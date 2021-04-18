// Default value is true
// User can turn this off using options page
var strip_cors = true;

const valid_sites = new RegExp('http://localhost/*|https://tracedigital.tk/*');

// Keep track of redirected urls - THIS IS A HACK
var redirected_urls = [];
var ACCEPTED_HEADERS = ['accept', 'authorization', 'content-type', 'Referer', 'User-Agent', 'auth-token', 'x-amz-user-agent','x-amz-target'];

chrome.runtime.onMessage.addListener((request) => {
    // get username from the content script
    console.log("Message received in background.js!", request.username);
    console.log(request.site);

    if (request.type === "request_username" && request.username) {
        // TODO: make popup from extension icon, not a new window
        chrome.windows.create({
            url: chrome.runtime.getURL('dialog.html'),
            type: 'popup',
            focused: true,
            height: 450,
            width: 400,
            setSelfAsOpener: true
        });

        // var windowFeatures = "width=400, height=450";
        // var newWindow = window.open(chrome.runtime.getURL('dialog.html'), "Trace", windowFeatures);
        // if (window.focus) {
        //     newWindow.focus()
        // }

        // Pass database information to dialog window
        window.trace_username = request.username;
        window.trace_site = request.site;
    }
    else if (request.type === "disable_cors" && request.message) {
        if (request.message === "false") {
            strip_cors = false;
        } else if (request.message === "true") {
            strip_cors = true;
        }
    }
});

// If we want to copy headers from requests to responses
// This function is unused for now
chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        console.log("Request: ");
        console.log(details);
    },
    {
        urls: ['<all_urls>'],
        types: ['xmlhttprequest', 'other']//,'stylesheet','script','image','object','xmlhttprequest','other']
    },
    ["blocking", "requestHeaders"]
);

chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
        console.log("Response: ");
        console.log(details);
        let valid_initiator = checkInitiator(details);

        if (valid_initiator && strip_cors) {
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
                changeHeaders(details, '*', ACCEPTED_HEADERS.join(','), 'false');
                // Remove this url from the array of redirected urls
                redirected_urls.splice(redirected_urls.indexOf(details.url), 1);
            } else {
                changeHeaders(details, details.initiator, ACCEPTED_HEADERS.join(','), 'true');
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
        if (details.responseHeaders[i].name.toLowerCase() === 'access-control-allow-origin') {
            access_control_origin_index = i;
            details.responseHeaders[i].value = allow_origin_value;
        }
        if (details.responseHeaders[i].name.toLowerCase() === 'access-control-allow-headers') {
            access_control_headers_index = i;
            details.responseHeaders[i].value = allow_headers_value;
        }
        if (details.responseHeaders[i].name.toLowerCase() === 'access-control-allow-credentials') {
            access_control_creds_index = i;
            details.responseHeaders[i].value = allow_credentials_value;
        }
    }
    // Add headers if they don't exist
    if (access_control_origin_index === -1) {
        details.responseHeaders.push({name: 'Access-Control-Allow-Origin', value: allow_origin_value})
    }
    if (access_control_headers_index === -1) {
        details.responseHeaders.push({name: 'Access-Control-Allow-Headers', value: allow_headers_value})
    }
    if (access_control_creds_index === -1) {
        details.responseHeaders.push({name: 'Access-Control-Allow-Credentials', value: allow_credentials_value})
    }
}

// Find new redirected url
function getLocation(details) {
    for (var i = 0; i < details.responseHeaders.length; i++) {
        if (details.responseHeaders[i].name.toLowerCase() === 'location') {
            return details.responseHeaders[i].value;
        }
    }
    return null;
}

// Check if request came from a site we want to strip cors from
function checkInitiator(details) {
    console.log(details.initiator);
    if (valid_sites.test(details.initiator)) {
        return true;
    }
    return false;
}
