
var strip_cors = true;

// TODO: Add our site when deployed
const valid_sites = new RegExp('http://localhost/*');

chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
        strip_cors = checkInitiator(details);
        var access_control_origin_index = -1;
        var access_control_headers_index = -1;
        var access_control_creds_index = -1;
        if (strip_cors) {
            for (var i = 0; i < details.responseHeaders.length; i++) {
                if (details.responseHeaders[i].name.toLowerCase() == 'access-control-allow-origin') {
                    access_control_origin_index = i;
                    details.responseHeaders[i].value = details.initiator;
                }
                if (details.responseHeaders[i].name.toLowerCase() == 'access-control-allow-headers') {
                    access_control_headers_index = i;
                    details.responseHeaders[i].value = 'Include';
                }
                if (details.responseHeaders[i].name.toLowerCase() == 'access-control-allow-credentials') {
                    access_control_creds_index = i;
                    details.responseHeaders[i].value = 'Expose';
                }
            }
            if (access_control_origin_index == -1) {
                details.responseHeaders.push({name: 'Access-Control-Allow-Origin', value: details.initiator})
            }
            if (access_control_headers_index == -1) {
                details.responseHeaders.push({name: 'Access-Control-Allow-Headers', value: 'Include'})
            }
            if (access_control_creds_index == -1) {
                details.responseHeaders.push({name: 'Access-Control-Allow-Credentials', value: 'Expose'})
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

// Check if request came from a valid site
function checkInitiator(details) {
    console.log(details.initiator);
    if (valid_sites.test(details.initiator)) {
        return true;
    }
    return false;
}