var strip_cors = true;
console.log("HELLO");

chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
        var access_control_header_index = -1;
        if (strip_cors) {
            for (var i = 0; i < details.responseHeaders.length; i++) {
                if (details.responseHeaders[i].name.toLowerCase() == 'access-control-allow-origin') {
                    console.log("header found")
                    access_control_header_index = i;
                    details.responseHeaders[i].value = '*';
                }
            }
            if (access_control_header_index == -1) {
                details.responseHeaders.push({name: 'Access-Control-Allow-Origin', value: '*'})
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
);
