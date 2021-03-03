/**
 * https://stackoverflow.com/questions/8739605/getelementbyid-returns-null
 */
(function (window, document, undefined) {
  // code that should be taken care of right away

  window.onload = init;

  function init() {
    document.getElementById("entry").addEventListener("input", validateInput);
    document.getElementById("email").addEventListener("click", validateInput);
    document
      .getElementById("password")
      .addEventListener("click", validateInput);
    document.getElementById("search").addEventListener("click", haveIBeenPwnd);
  }
})(window, document, undefined);

/**
 * Controls submit button being disabled if form fields aren't filled out correctly
 * Requirements:
 *      Text box must have some text input
 *      One of the radio buttons must be selected
 */
const validateInput = () => {
  if ($("#entry").val() == "" || $("#entry").val() == undefined) {
    $("#search").attr("disabled", true);
  } else if ($("#email").prop("checked") == $("#password").prop("checked")) {
    $("#search").attr("disabled", true);
  } else {
    $("#search").attr("disabled", false);
  }
};

/**
 * Depending on submitted data, check if email or password has been pwnd and display the data
 * @param {*} event
 */
const haveIBeenPwnd = async (event) => {
  const entry = $("#entry").val();
  const isEmail = $("#email").prop("checked");
  const isPassword = $("#password").prop("checked");

  if (isEmail) {
    await hasEmailBeenPwnd(entry);
  } else {
    // isPassword
    await hasPasswordBeenPwnd(entry);
  }
};

/**
 * Actual HIBP Requests
 */

const request_headers = {
  "hibp-api-key": "", // TODO: don't commit this
};

const hasEmailBeenPwnd = async (email) => {
  const aws_api_gateway = "";                                     

  const url = `${aws_api_gateway}/breachedaccount/${email}`;

  const emailData = await fetch(url, { headers: request_headers })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log(error);
      return {};
    });

  console.log(emailData);

  // TODO: maybe call detailed view?
  // GET https://haveibeenpwned.com/api/v3/breach/{name}
  // idea: give list of websites, and then link to deep link (ex:  https://haveibeenpwned.com/account/test@example.com )
};

const hasPasswordBeenPwnd = async (password) => {
  const aws_api_gateway = "";

  const hashedPassword = (await sha1(password)).toString();
  console.log(hashedPassword.substring(0,5))
  const url = `${aws_api_gateway}/range/${hashedPassword.substring(0, 5)}`;

  const passwordData = await fetch(url, { headers: request_headers })
    .then((response) => {
      return response.text();
    })
    .catch((error) => {
      console.log(error);
      return "";
    });

  const passwords = passwordData.split("\r\n")
  
  let numTimesPwnd = 0

  for (password of passwords) {
    console.log(password)
    console.log(parseInt(password.split(":")[1]))
    numTimesPwnd += parseInt(password.split(":")[1])
  }

  console.log(`You've been Pwnd ${numTimesPwnd} times!`)    // TODO: something's not quite right...

};



// SHA-1 Implementation
//https://github.com/jamiebuilds/havetheybeenpwned/blob/master/lib/sha1-browser.js
("use strict");

function bufferToHex(buffer) {
  let view = new DataView(buffer);
  let hexCodes = "";
  for (let i = 0; i < view.byteLength; i += 4) {
    hexCodes += view.getUint32(i).toString(16).padStart(8, "0");
  }
  return hexCodes;
}

function sha1(str) {
  let buffer = new TextEncoder().encode(str);
  return crypto.subtle
    .digest("SHA-1", buffer)
    .then((hash) => bufferToHex(hash));
}
