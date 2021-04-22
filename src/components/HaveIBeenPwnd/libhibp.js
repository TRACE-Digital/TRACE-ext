import $ from 'jquery';
import sha1 from 'sha1'
  
  /**
   * Controls submit button being disabled if form fields aren't filled out correctly
   * Requirements:
   *      Text box must have some text input
   *      One of the radio buttons must be selected
   */
  export const validateInput = () => {
    // If one of the options is checked, enable text box input
    if (emailSelected() || passwordSelected()) {
      // if either radio is checked, enable text box input
      $("#entry").attr("disabled", false);
    } else if (!emailSelected() && !passwordSelected()) {
      // if neither radio is checked, disable text box input
      $("#entry").attr("disabled", true);
    }
  
    let entry
    // Controls hiding of password input
    if (passwordSelected()) {
      //If the password selection is made, hide password input
      entry = document.getElementById("entry");
      entry.type = "password";
    } else {
      // otherwise, don't hide password input
      entry = document.getElementById("entry");
      entry.type = "email";
    }
  
    // If both the text box input AND radio selection has been made, allow search
    if (inputEmpty()) {
      // if no valid text in entry field, disable search option
      $(".searchButton").attr("disabled", true);
    } else if (emailSelected() === passwordSelected()) {
      // if both radios are unchecked, or (somehow) both checked, disable search option
      $(".searchButton").attr("disabled", true);
    } else {
      // Otherwise, a normal search can proceed
      $(".searchButton").attr("disabled", false);
    }
  };
  
  
  /**
   * Depending on submitted data, check if email or password has been pwnd and display the data
   * @param {*} event
   */
  export const haveIBeenPwnd = async (event) => {
    event.preventDefault();   // prevent page reload

    const entry = $("#entry").val();
    const isEmail = $("#email").prop("checked");
    // const isPassword = $("#password").prop("checked");
  
    if (isEmail) {
      // If entry is an email, validate email before continuing
      if (validateEmail(entry)) {
        await hasEmailBeenPwnd(entry);
      } else {
        showData('<h5 className="error">Please enter a valid email!</h5>');
      }
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
    showData(`<h5>Checking known breaches and pastebins for ${email}...</h5>`);
  
    /////////////// Email check! ///////////////
    const emailUrl = `${AWSApiGateway}/breachedaccount/${email}`;
  
    const emailData = await fetch(emailUrl)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        // console.log(error);
        return [];
      });
  
    /////////////// Pastebin check! ///////////////
    const pastebinUrl = `${AWSApiGateway}/pasteaccount/${email}`;
  
    const pastebinData = await fetch(pastebinUrl)
      .then((response) => {
        // console.log(response);
        return response.json();
      })
      .catch((error) => {
        // console.log(error);
        return [];
      });
  
    /////////////// Show final results on screen ///////////////
    let emailResults = await buildEmailResults(emailData, pastebinData);
    showData(emailResults);
  };
  
  
  /**
   * Checks the HaveIBeenPwnd API for how many times a given password has been exposed in a data breach
   * @param {*} password
   */
  const hasPasswordBeenPwnd = async (password) => {
    showData("<h5>Checking known breaches for your password...</h5>");
  
    // This API endpoint requires the first 5 characters of the SHA1 hash
    const hashedPassword = (await sha1(password)).toString().toUpperCase();
  
    const url = `${AWSApiGateway}/range/${hashedPassword.substring(0, 5)}`;
  
    const passwordData = await fetch(url)
      .then((response) => {
        return response.text();
      })
      .catch((_error) => {
        return "";
      });
  
    const passwords = passwordData.split("\r\n");
  
    let numTimesPwnd = 0;
  
    for (password of passwords) {
      const hash = password.split(":")[0];
      const num = password.split(":")[1];
      if (hashedPassword.substring(5).localeCompare(hash) === 0) {
        numTimesPwnd += parseInt(num);
      }
    }
  
    if (numTimesPwnd === 0) {
      showData("<h5>This password has never been exposed!</h5>");
      // $("*").removeClass("pwnd");
      // $("*").addClass("notPwnd");
    } else {
      showData(`<h5>This password has been exposed ${numTimesPwnd} times.</h5>`);
      // $("*").removeClass("notPwnd");
      // $("*").addClass("pwnd");
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
  
    if (emailData.length !== 0) {
      pwnd = true;
      emailResults +=
        "<h5>Yikes! Your email has been exposed on the following websites:</h5>\n";
      emailResults += "<ul>";
      for (const email of emailData) {
        let siteName = JSON.stringify(email.Name);
        siteName = siteName.substring(1, siteName.length - 1);
  
        // emailResults += `<li><a href="https://haveibeenpwned.com/api/v3/breach/${siteName}">${siteName}</a></li>\n`;   // TODO: keep this?
        emailResults += `<li>${siteName}</li>\n`;
      }
      emailResults += "</ul>\n\n<br/>\n";
    }
  
    if (pastebinData.length !== 0) {
      pwnd = true;
      emailResults +=
        emailData.length !== 0
          ? "<h5>...and the following pastebin leaks:</h5>\n"
          : "<h5>Yikes! Your email has been exposed in the following pastebin leaks:</h5>";
  
      emailResults += "<ul>";
      for (const pastebin of pastebinData) {
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
  
    if (emailResults.length === 0) {
      emailResults += "<h5>Your email has never been exposed!</h5>";
    }
  
    // if (pwnd) {
    //   $("h45").removeClass("notPwnd");
    //   $("h5").addClass("pwnd");
    // } else {
    //   $("h5").removeClass("pwnd");
    //   $("h5").addClass("notPwnd");
    // }
  
    return emailResults;
  };
  

  /**************************************************************/
  /*                      HELPER FUNCTIONS                      */
  /**************************************************************/
  
  // Displays data in a specified <div>
  const showData = (msg) => {
    $(".responseBody").html(msg);
  };
  
  // Returns true if email radio field is selected
  const emailSelected = () => {
    return $("#email").prop("checked");
  };
  
  // Returns true if password radio field is selected
  const passwordSelected = () => {
    return $("#password").prop("checked");
  };
  
  // Returns true if input text field is empty
  const inputEmpty = () => {
    return $("#entry").val() === "" || $("#entry").val() === undefined;
  };
  
  // Returns true if a string is a valid email
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  const AWSApiGateway =
    "https://s7kbw14q30.execute-api.us-east-2.amazonaws.com/production/";
