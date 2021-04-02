// import { ManualAccount, tags } from 'trace-search';

// const Trace = require('trace-search');

let username = window.opener.trace_username.includes('@') ? 
    window.opener.trace_username.substring(0, window.opener.trace_username.indexOf('@')) : 
    window.opener.trace_username;
let site = window.opener.trace_site;
let account = window.opener.trace_site.concat("/", username);

checkIfSiteExists();

document.getElementById("username").value = window.opener.trace_username;
document.getElementById("siteName").value = window.opener.trace_site;
document.getElementById("url").value = window.opener.trace_site.concat("/", username);

// Getting user info
let traceUser = JSON.parse(localStorage.getItem("trace-user"));

async function getDb() {
    try {
        let db = await window.TraceSearch.getDb();
        console.log(db);

        return db;
    } catch (err) {
        console.log(err);
    }
}

async function checkIfSiteExists() {
    const traceDb = getDb();

    const manualSite = { url: account, name: site, tags: [] };
    const manualAccount = new window.TraceSearch.ManualAccount(manualSite, username);

    // Add to database
    try {
        await traceDb.get(manualAccount.id);
    } catch (e) {
        console.log("Account exists");
        window.close();
    }
}

document.getElementById("save").addEventListener('click', 
    async function(e) {
        let username = document.getElementById("username").value;
        let siteName = document.getElementById("siteName").value;
        let url = document.getElementById("url").value;

        console.log(username);
        console.log(siteName);
        console.log(url);
        
        const manualSite = { url: url, name: siteName, tags: [] };
        const manualAccount = new window.TraceSearch.ManualAccount(manualSite, username);

        // Add to database
        try {
            await manualAccount.save();
            // window.close();
        } catch (e) {
            if (e.message === "Document update conflict") {
                document.getElementById('error').innerHTML = "Account already exists";
            } else {
                document.getElementById('error').innerHTML = e.message;
            }
        }
    }, false
);

document.getElementById("cancel").addEventListener('click', 
    function(e) {
        window.close();
    }, false
);