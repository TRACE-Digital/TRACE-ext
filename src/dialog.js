// import { ManualAccount, tags } from 'trace-search';

// const Trace = require('trace-search');

console.log(window.opener);
console.log(window.TraceSearch.tags);

// chrome.runtime.onMessage.addListener((request) => {
//     console.log("Request recieved");
//     let username = request.username;
//     document.getElementById("username").value = request.username;
//     document.getElementById("siteName").value = request.site;

//     if (request.username.includes('@')) {
//         username = request.username.substring(0, request.username.indexOf('@'));
//     }
//     document.getElementById("url").value = request.site.concat("/", username);
// });

let username = window.opener.trace_username;
if (username.includes('@')) {
    username = username.substring(0, username.indexOf('@'));
}
document.getElementById("username").value = window.opener.trace_username;
document.getElementById("siteName").value = window.opener.trace_site;
document.getElementById("url").value = window.opener.trace_site.concat("/", username);

document.getElementById("save").addEventListener('click', 
    async function(e) {
        let username = document.getElementById("username").value;
        let siteName = document.getElementById("siteName").value;
        let url = document.getElementById("url").value;

        console.log(username);
        console.log(siteName);
        console.log(url);

        // console.log("This is the tab id we're using " + tab[0].id);
        // chrome.tabs.sendMessage(tab[0].id, { "username": username, "site": siteName, "url": url });
        // chrome.runtime.sendMessage({type:'database_info', username: username, site: siteName, url: url});
        
        // const manualSite = { url: url, name: siteName, tags: [] };
        // const manualAccount = new ManualAccount(manualSite, username);

        // // Add to database
        // try {
        //     await manualAccount.save();
        //     window.close();
        // } catch (e) {
        //     if (e.message === "Document update conflict") {
        //         document.getElementById('error').innerHTML = "Account already exists";
        //     } else {
        //         document.getElementById('error').innerHTML = e.message;
        //     }
        // }
    }, false
);

document.getElementById("cancel").addEventListener('click', 
    function(e) {
        window.close();
    }, false
);