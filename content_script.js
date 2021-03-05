// Executes after page load.

/* Sign in or sign up text 
    'sign in', 
    'log in', 
    'create account',
    'create an account',
    'sign up',
    'join',
    'register'
*/

/* Username text
    'username',
    'login',
    'signup_name'
*/

/* Email text
    'email'
*/

// TODO: "continue" is used for multiple page log in
// TODO: detect logins in iframes like on www.reddit.com

const signInRegex = new RegExp('.*(((log|sign) (in|up))|((create( an)* account)|join|register)).*');
const usernameRegex = new RegExp('.*(username|signup_name|login).*');
const emailRegex = new RegExp('.*(email).*');

var username = null;

window.addEventListener('load', 
    function(e) {
        if (document.readyState === "complete") {
            if (!main()) {
                setTimeout(main, 1000);
            }
            // setInterval(getFrames, 10000);
        }
    }, false
);

window.addEventListener('click',
    function(e) {
        if (document.readyState === "complete") {
            if (!main()) {
                setTimeout(main, 1000);
            }
        }
    }, false
);

window.addEventListener('submit', 
    function(e) {
        console.log(username);
        if (username) { 
            console.log(username.value);
        }
    }, false
);

// Find sign in popups
// function getFrames() {
//     var frames = document.getElementsByTagName("iframe");
//     console.log(frames);
// }

function main() {
    if (verifySignInOrSignUpPage()) {
        username = findUsernameField();
        if (username) {
            username.addEventListener('input', 
                function(e) {
                    console.log(username);
                    if (username) { 
                        console.log(username.value);
                    }
                }, false
            );
        }
        return true;
    }
    return false;
}

const verifySignInOrSignUpPage = () => {
    // grab potential sign in or sign up elements
    var inputs = document.getElementsByTagName('input');
    var buttons = document.getElementsByTagName('button');

    // check inputs
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type.toLowerCase() == 'submit') {
            console.log(inputs[i].value.toLowerCase());
            if (inputs[i].value && signInRegex.test(inputs[i].value.toLowerCase())) {
                console.log("true");
                return true;
            }
        }
    }

    // check buttons
    for (var i = 0; i < buttons.length; i++) {
        console.log(buttons[i].className);
        if (buttons[i].type.toLowerCase() == 'submit') {
            console.log(buttons[i].innerHTML.trim().toLowerCase());
            if (buttons[i].innerHTML && signInRegex.test(buttons[i].innerHTML.trim().toLowerCase())) {
                console.log("true");
                return true;
            }
        }
    }
    console.log("false");
    return false;
}

// Find the username for easy add to dashboard
const findUsernameField = () => {
    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        console.log(inputs[i].id.toLowerCase());
        if ((inputs[i].name && usernameRegex.test(inputs[i].name.toLowerCase()))
             || (inputs[i].id && usernameRegex.test(inputs[i].id.toLowerCase()))
             || (inputs[i].placeholder && usernameRegex.test(inputs[i].placeholder.toLowerCase()))
            ) {
            console.log(inputs[i]);
            return inputs[i];
        } 
        else if ((inputs[i].name && emailRegex.test(inputs[i].name.toLowerCase()))
                || (inputs[i].id && emailRegex.test(inputs[i].id.toLowerCase()))
                || (inputs[i].placeholder && emailRegex.test(inputs[i].placeholder.toLowerCase()))
            ) {
            console.log(inputs[i]);
            return inputs[i];
        }
    }
}

// Not used, might be expanded later for password manager
const findPasswordField = () => {
    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type.toLowerCase() == 'password') {
            console.log(inputs[i].value);
        }
    }
}