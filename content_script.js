// Executes after page load.

/* Sign in or sign up text 
    'sign in', 
    'log in', 
    'create account',
    'sign up'
*/

/* Log in text
    'username',
    'login'
*/

const signInRegex = new RegExp('.*(((log|sign) (in|up))|(create account)).*');
const logInRegex = new RegExp('.*(username|login).*')

var username = null;

window.addEventListener('load', 
    function(e) {
        if (document.readyState === "complete") {
            if (!main()) {
                setTimeout(main, 1000);
            }
        }
        // else {
        //     window['onload'] = function () {
        //         if (verifySignInOrSignUpPage()) {
        //             findUsernameField();
        //         }
        //     }
        // }
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

function main() {
    if (verifySignInOrSignUpPage()) {
        username = findUsernameField();
        username.addEventListener('input', 
            function(e) {
                console.log(username);
                if (username) { 
                    console.log(username.value);
                }
            }, false
        );
        return true;
    }
    return false;
}

const verifySignInOrSignUpPage = () => {
    // grab potential sign in or sign up elements
    var inputs = document.getElementsByTagName('input');
    var buttons = document.getElementsByTagName('button');

    console.log(buttons);
    console.log(buttons.length);

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
        if ((inputs[i].name && logInRegex.test(inputs[i].name.toLowerCase()))
             || (inputs[i].id && logInRegex.test(inputs[i].id.toLowerCase()))
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