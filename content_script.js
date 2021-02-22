// Put all the javascript code here, that you want to execute after page load.

window.addEventListener("submit", 
    function(e) {
        if (document.readyState === "complete") {
            findUsernameField();
        }
        else {
            window['onload'] = function () {
                findUsernameField();
            }
        }
    }, false
);

// Find the username for easy add to dashboard
const findUsernameField = () => {
    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type.toLowerCase() == 'login') {
            console.log(inputs[i].value);
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