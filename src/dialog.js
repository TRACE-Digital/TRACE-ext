// import { ManualAccount, tags } from 'trace-search';

// const Trace = require('trace-search');

let username = window.opener.trace_username;
let trim_username = username.includes('@') ? username.substring(0, username.indexOf('@')) : username;
let site = window.opener.trace_site;
let account = window.opener.trace_site.concat("/", username);

checkIfSiteExists();

document.getElementById("username").value = window.opener.trace_username;
document.getElementById("siteName").value = window.opener.trace_site;
document.getElementById("url").value = window.opener.trace_site.concat("/", trim_username);

// Getting user info
let traceUser = JSON.parse(localStorage.getItem("trace-user"));

async function checkIfSiteExists() {
    let traceDb;
    try {
        traceDb = await window.TraceSearch.getDb();
        await window.TraceSearch.setRemoteUser(traceUser);
        await window.TraceSearch.setupReplication();
    } catch (err) {
        console.log(err);
    }
    console.log(traceDb);

    const manualSite = { url: account, name: site, tags: [] };
    const manualAccount = new window.TraceSearch.ManualAccount(manualSite, username);

    // Check if it exists in database
    try {
        await traceDb.get(manualAccount.id);
        console.log("Account exists");
        window.close();
    } catch (e) {
        console.log(e);
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
            window.close();
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
