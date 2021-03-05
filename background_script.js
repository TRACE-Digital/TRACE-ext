
var strip_cors = true;

const valid_sites = new RegExp('http://localhost/*|https://tracedigital.tk/*');

// Keep track of redirected urls - THIS IS A HACK FOR NOW
var redirected_urls = [];

chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
        strip_cors = checkInitiator(details);

        if (strip_cors) {
            console.log(details.url);
            // Check if redirected url
            if (redirected_urls.includes(details.url)) {
                console.log("This is a redirected URL");
                // Set access-control-allow-origin header to wildcard for redirected urls
                // because initial initiator is immutable but origin will change causing CORS error
                changeHeaders(details, '*', 'Include', 'Expose');
                // Remove this url from the list of redirected urls
                redirected_urls.splice(redirected_urls.indexOf(details.url), 1);
            }
            else {
                // Check status code for redirects
                if (details.statusCode < 400 && details.statusCode >= 300) {
                    console.log("This site is redirecting to another URL");
                    var location = getLocation(details);
                    if (location) {
                        redirected_urls.push(location);
                    }
                }
                changeHeaders(details, details.initiator, 'Include', 'Expose');
            }
        }
        console.log(details);
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
    console.log(details.initiator);
    if (valid_sites.test(details.initiator)) {
        return true;
    }
    return false;
}