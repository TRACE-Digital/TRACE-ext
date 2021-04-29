# TRACE Browser Extension #

This extension adds capabilities to the [TRACE](https://tracedigital.tk) website.
The extension is officially supported and tested in Chrome/Firefox.
It should also be compatible with other Chromium-based browsers like Edge or Brave.

The extension includes the following features: 

### Blocking CORS errors ###

CORS errors occur when we make requests to other sites to determine if an account exists. We only block CORS on requests coming from our site. The following headers are modified to support our search functionality:

1. Changed response header `access-control-allow-origin` to initiator of the request or `*` if a redirected URL
1. Changed response header `access-control-allow-headers` to `'accept', 'authorization', 'content-type', 'Referer', 'User-Agent', 'auth-token', 'x-amz-user-agent','x-amz-target'`
    1. Should eventually be changed to intercept the request headers and copy thme to the response
1. Changed response header `Access-Control-Allow_Credentials` to true unless its a redirected URL

### Detecting new sites ###

Like a password manager, we detect whenever users log into a site that they don't have in TRACE and pull the username, site name, and site url from the page to make it easier for users to add new sites. Our content script monitors inputs on each page to determine if it's a sign in or sign up page. By pulling inputs with the name "username" or "name", we can autofill most of the information necessary to add to TRACE. The workflow is as follows:

1. Content script checks for sign in and sign up pages on page load
1. Content script gets the value of the username field and sends a message with the username to the background script on submit
1. When the background script receives a message from the content script, it opens a window with the username pre-filled to prompt user to add the account to TRACE
1. User can edit the form information before adding the acount to TRACE

### Privacy tools ###

The extension also includes several privacy tools:

1. Check for password or email breaches
1. Generate strong passwords
1. Test password strength

## Prerequisites ##

| Tool   | Version  |
| ------ | -------- |
| `node` | `14.3.0` |
| `npm`  | `6.14.5` |

## Development ##

1. `npm install`
1. `npm run build`
1. `npm run firefox` or `npm run chrome`

## Publish ##

1. `npm install`
1. `npm run package`
1. Upload to https://chrome.google.com/webstore/devconsole or https://addons.mozilla.org
