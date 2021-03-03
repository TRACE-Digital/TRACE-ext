/**     TODO
 * Call Have I Been Pwnd API depending on radio selection
 * CSS for widget color green if not compromised
 * CSS for widget color red if compromised
 * Return results
 */


 /**
  * https://stackoverflow.com/questions/8739605/getelementbyid-returns-null
  */
(function(window, document, undefined){

    // code that should be taken care of right away

    window.onload = init;
    
      function init(){
        document.getElementById('entry').addEventListener('input', validateInput);
        document.getElementById('email').addEventListener('click', validateInput);
        document.getElementById('password').addEventListener('click', validateInput);
        document.getElementById('search').addEventListener('click', haveIBeenPwnd);
      }
    
})(window, document, undefined);
    

/**
 * Controls submit button being disabled if form fields aren't filled out correctly
 * Requirements:
 *      Text box must have some text input
 *      One of the radio buttons must be selected
 */
const validateInput = () => {
    if ($('#entry').val() == '' || $('#entry').val() == undefined) {
        $('#search').attr("disabled", true)
    }
    else if (($('#email').prop("checked") == $('#password').prop("checked"))) {
        $('#search').attr("disabled", true)
    }
    else {
        $('#search').attr("disabled", false)
    }
}

/**
 * Depending on submitted data, check if email or password has been pwnd and display the data
 * @param {*} event 
 */
const haveIBeenPwnd = async (event) => {
    const entry = $('#entry').val()
    const isEmail = $('#email').prop("checked")
    const isPassword = $('#password').prop("checked")

    if (isEmail) {
        await hasEmailBeenPwnd(entry)
    }
    else {  // isPassword
        await hasPasswordBeenPwnd(entry)
    }
}



/**
 * Actual HIBP Requests
 */

const request_headers = {
    "hibp-api-key": "",         // TODO: don't commit this
}

const hasEmailBeenPwnd = async (email) => {
    const service = "breachedaccount"
    const url = `https://haveibeenpwned.com/api/v3/${service}/${email}`

    const emailData = await fetch(url, { headers: request_headers })
                                .catch( (error) => {
                                    console.log(error)
                                })

    console.log(emailData)

    // TODO: maybe call detailed view?
    // GET https://haveibeenpwned.com/api/v3/breach/{name}
    // idea: give list of websites, and then link to deep link (ex:  https://haveibeenpwned.com/account/test@example.com )
}

const hasPasswordBeenPwnd = async (password) => {
    const hashedPassword = password       // TODO: compute SHA1
    const url = `https://api.pwnedpasswords.com/range/${hashedPassword.substring(0,5)}`
    const passwordData = await fetch(url, { headers: request_headers })
                                    .catch( (error) => {
                                        console.log(error)
                                    })

    console.log(passwordData)
}
