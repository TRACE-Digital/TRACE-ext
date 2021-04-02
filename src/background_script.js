var strip_cors = true;

const valid_sites = new RegExp('http://localhost/*|https://tracedigital.tk/*');

// Keep track of redirected urls - THIS IS A HACK
var redirected_urls = [];
var ACCEPTED_HEADERS = ['accept', 'authorization', 'content-type', 'Referer', 'User-Agent', 'auth-token', 'x-amz-user-agent'];

chrome.runtime.onMessage.addListener((request) => {
    // get username from the content script
    console.log("Message received in background.js!", request.username);
    console.log(request.site);

    if (request.type === "request_username" && request.username) {
        // set global variable username to message from content script
        // chrome.tabs.create({
        //     url: chrome.extension.getURL('dialog.html'),
        //     active: false
        // }, function(tab) {
        //     // After the tab has been created, open a window to inject the tab
        //     chrome.windows.create({
        //         tabId: tab.id,
        //         type: 'popup',
        //         focused: true,
        //         height: 450,
        //         width: 400,
        //         setSelfAsOpener: true
        //     });

        //     chrome.tabs.onUpdated.addListener(function(id, changeInfo, thisTab) {
        //         if (changeInfo.status == 'complete') {
        //             chrome.tabs.query({ active: true }, function(tabs) {
        //                 chrome.tabs.sendMessage(tab.id, { "username": request.username, "site": request.site });
        //             })
        //         }
        //     });
        // });

        chrome.windows.create({
            url: chrome.extension.getURL('dialog.html'),
            type: 'popup',
            focused: true,
            height: 450,
            width: 400,
            setSelfAsOpener: true
        });

        // Pass database information to dialog window
        window.trace_username = request.username;
        window.trace_site = request.site;
    }
});

chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
        strip_cors = checkInitiator(details);

        if (strip_cors) {
            // console.log(details.url);
            // Check if site is getting redirected
            if (details.statusCode < 400 && details.statusCode >= 300) {
                // console.log("This site is redirecting to another URL");
                var location = getLocation(details);
                if (location) {
                    // Add location to array to check for next time
                    redirected_urls.push(location);
                }
            }

            // Check if redirected url
            if (redirected_urls.includes(details.url)) {
                // console.log("This is a redirected URL");
                // Set access-control-allow-origin header to wildcard for redirected urls
                // because initial initiator is immutable but origin will change causing CORS error
                changeHeaders(details, '*', ACCEPTED_HEADERS.join(','), 'true');
                // Remove this url from the array of redirected urls
                redirected_urls.splice(redirected_urls.indexOf(details.url), 1);
            } else {
                changeHeaders(details, details.initiator, 'accept, authorization, content-type, Referer, User-Agent', 'true');
            }
        }
        // console.log(details);
        return { responseHeaders: details.responseHeaders };
    },
    {
        urls: ['<all_urls>'],
        types: ['xmlhttprequest', 'other']//,'stylesheet','script','image','object','xmlhttprequest','other']
    },
    ['blocking', 'responseHeaders', 'extraHeaders']
    // https://developer.chrome.com/docs/extensions/reference/webRequest/#life-cycle-of-requests
);

// Change header values if they exist, add them if not
function changeHeaders(details, allow_origin_value, allow_headers_value, allow_credentials_value) {

    var access_control_origin_index = -1;
    var access_control_headers_index = -1;
    var access_control_creds_index = -1;

    // Modify headers to allow CORS
    for (var i = 0; i < details.responseHeaders.length; i++) {
        if (details.responseHeaders[i].name.toLowerCase() == 'access-control-allow-origin') {
            access_control_origin_index = i;
            details.responseHeaders[i].value = allow_origin_value;
        }
        if (details.responseHeaders[i].name.toLowerCase() == 'access-control-allow-headers') {
            access_control_headers_index = i;
            details.responseHeaders[i].value = allow_headers_value;
        }
        if (details.responseHeaders[i].name.toLowerCase() == 'access-control-allow-credentials') {
            access_control_creds_index = i;
            details.responseHeaders[i].value = allow_credentials_value;
        }
    }
    // Add headers if they don't exist
    if (access_control_origin_index == -1) {
        details.responseHeaders.push({name: 'Access-Control-Allow-Origin', value: allow_origin_value})
    }
    if (access_control_headers_index == -1) {
        details.responseHeaders.push({name: 'Access-Control-Allow-Headers', value: allow_headers_value})
    }
    if (access_control_creds_index == -1) {
        details.responseHeaders.push({name: 'Access-Control-Allow-Credentials', value: allow_credentials_value})
    }
}

// Find new redirected url
function getLocation(details) {
    for (var i = 0; i < details.responseHeaders.length; i++) {
        if (details.responseHeaders[i].name.toLowerCase() == 'location') {
            return details.responseHeaders[i].value;
        }
    }
    return null;
}

// Check if request came from a valid site
function checkInitiator(details) {
    // console.log(details.initiator);
    if (valid_sites.test(details.initiator)) {
        return true;
    }
    return false;
}
