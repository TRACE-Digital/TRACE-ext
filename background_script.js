var strip_cors = true;

chrome.webRequest.onHeadersReceived.addListener(
    function (details) {

        console.log(details);

        var headers = details.responseHeaders;
        if (strip_cors) {
            for (var i = 0; i < headers.length; i++) {
                if (headers[i].name.toLowerCase() == 'access-control-allow-origin') {
                    headers[i].value = '*';
                }
            }
        }
        return { responseHeaders: headers };
    },
    {
        urls: ['<all_urls>'],
        types: ['main_frame', 'sub_frame']//,'stylesheet','script','image','object','xmlhttprequest','other']
    },
    ['blocking', 'responseHeaders']
);
