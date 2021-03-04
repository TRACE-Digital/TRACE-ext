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


/*
          SMALL HELPERS
*/



const showData = (msg) => {
  $(".responseBody").html(msg);
};

const AWSApiGateway =
  "https://s7kbw14q30.execute-api.us-east-2.amazonaws.com/production/";



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
 * Checks the HaveIBeenPwnd API for how many times a given email has been exposed in a data breach.
 * @param {*} email 
 */
const hasEmailBeenPwnd = async (email) => {
  showData(`Checking known breaches and pastebins for ${email}...`);

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
      console.log(response);
      return response.json();
    })
    .catch((error) => {
      console.log(error);
      return [];
    });

  /////////////// Show final results on screen ///////////////
  let emailResults = await buildEmailResults(emailData, pastebinData);
  showData(emailResults);

  // TODO: maybe call detailed view?
  // GET https://haveibeenpwned.com/api/v3/breach/{name}  '691a5b7a373d4f33b8c6bdfae0c4f4af'
  // idea: give list of websites, and then link to deep link (ex:  https://haveibeenpwned.com/account/test@example.com )
};


/**
 * Checks the HaveIBeenPwnd API for how many times a given password has been exposed in a data breach
 * @param {*} password 
 */
const hasPasswordBeenPwnd = async (password) => {
  showData("Checking known breaches for your password...");

  // This API endpoint requires the first 5 characters of the SHA1 hash
  const hashedPassword = (await sha1(password)).toString().toUpperCase();
  console.log(hashedPassword.substring(0, 5));

  const url = `${AWSApiGateway}/range/${hashedPassword.substring(0, 5)}`;

  const passwordData = await fetch(url)
    .then((response) => {
      return response.text();
    })
    .catch((error) => {
      console.log(error);
      return "";
    });

  const passwords = passwordData.split("\r\n");

  let numTimesPwnd = 0;

  for (password of passwords) {
    const hash = password.split(":")[0];
    const num = password.split(":")[1];
    if (hashedPassword.substring(5).localeCompare(hash) == 0) {
      numTimesPwnd += parseInt(num);
    }
  }

  if (numTimesPwnd == 0) {
    showData("This password has never been exposed!");
    $("body").addClass("notPwnd");
  } else {
    showData(`This password been exposed ${numTimesPwnd} times.`);
    $("body").addClass("pwnd");
  }
};


/**
 * Takes in the data received from HaveIBeenPwnd API and formats it in a visually pleasing way
 * @param {*} emailData 
 * @param {*} pastebinData 
 */
const buildEmailResults = async (emailData, pastebinData) => {
  let pwnd = false;
  let emailResults = "";

  if (emailData.length != 0) {
    pwnd = true;
    emailResults +=
      "<h3>Yikes! Your email has been exposed on the following websites:</h3>\n";
    emailResults += "<ul>";
    for (email of emailData) {
      let siteName = JSON.stringify(email.Name);
      siteName = siteName.substring(1, siteName.length - 1);

      // emailResults += `<li><a href="https://haveibeenpwned.com/api/v3/breach/${siteName}">${siteName}</a></li>\n`;   // TODO: keep this?
      emailResults += `<li>${siteName}</li>\n`;
    }
    emailResults += "</ul>\n\n<br/>\n";
  }

  if (pastebinData.length != 0) {
    pwnd = true;
    emailResults +=
      emailData.length != 0
        ? "<h3>...and the following pastebin leaks:</h3>\n"
        : "<h3>Yikes! Your email has been exposed in the following pastebin leaks:</h3>";

    emailResults += "<ul>";
    for (pastebin of pastebinData) {
      const source = JSON.stringify(pastebin.Source);
      const id = JSON.stringify(pastebin.Id);
      const title = JSON.stringify(pastebin.Title);
      const date = JSON.stringify(pastebin.Date);
      const emailCount = JSON.stringify(pastebin.EmailCount);
      emailResults += `<li> <p><strong>Source:</strong>     ${source}</p>
                            <p><strong>Id:</strong>         ${id}</p>
                            <p><strong>Title:</strong>      ${title}</p>
                            <p><strong>Date:</strong>       ${date}</p>
                            <p><strong>EmailCount:</strong> ${emailCount}</p>
                      </li>\n`;
    }
    emailResults += "</ul>\n\n<br/><br/>";
  }

  pwnd ? $("body").addClass("pwnd") : $("body").addClass("notPwnd");

  return emailResults;
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
