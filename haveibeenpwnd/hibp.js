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

const AWSApiGateway = "https://s7kbw14q30.execute-api.us-east-2.amazonaws.com/production/";

const hasEmailBeenPwnd = async (email) => {
  showData(`Checking known breaches and pastebins for ${email}...`)

  /////////////// Email check! ///////////////
  const emailUrl = `${AWSApiGateway}/breachedaccount/${email}`;

  const emailData = await fetch(emailUrl)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log(error);
      return [];
    });


  /////////////// Pastebin check! ///////////////
  const pastebinUrl = `${AWSApiGateway}/pasteaccount/${email}`;

  const pastebinData = await fetch(pastebinUrl)
  .then((response) => {
    console.log(response)
    return response.json();
  })
  .catch((error) => {
    console.log(error);
    return [];
  });


  /////////////// Show final results on screen ///////////////
  let emailResults = await buildEmailResults(emailData, pastebinData)
  showData(emailResults)

  // TODO: maybe call detailed view?  https://haveibeenpwned.com/api/v3/pasteaccount
  // GET https://haveibeenpwned.com/api/v3/breach/{name}
  // idea: give list of websites, and then link to deep link (ex:  https://haveibeenpwned.com/account/test@example.com )
};


const hasPasswordBeenPwnd = async (password) => {
  showData("Checking known breaches for your password...")

  // This API endpoint requires the first 5 characters of the SHA1 hash
  const hashedPassword = (await sha1(password)).toString();
  console.log(hashedPassword.substring(0,5))

  const url = `${AWSApiGateway}/range/${hashedPassword.substring(0, 5)}`;

  const passwordData = await fetch(url)
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

  showData(`You've been Pwnd ${numTimesPwnd} times!`)    // TODO: something's not quite right with the number...
};


const showData = (msg) => {
  $('.responseBody').html(msg);
}

const buildEmailResults = async (emailData, pastebinData) => {
  let emailResults = ""

  if (length(emailData) != 0) {
    emailResults += "Yikes! Your email has been breached on the following websites:\n"
    for (email of emailData) {
      let siteName = JSON.stringify(email.Name)
      emailResults += siteName + "\n"
    }
  }

  if (length(pastebinData) != 0) {
    emailResults += "\n\nand the following pastebin leaks:"
    for (pastebin of pastebinData) {
      let pastebinName = JSON.stringify(pastebin)
      emailResults += pastebinName + "\n"
    }
  }

  return emailResults
}


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
