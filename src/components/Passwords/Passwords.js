import React, { useEffect, useState } from "react";
import { Input, Col, Button, Progress} from "reactstrap";
import generator from "generate-password";
import { PasswordMeter } from "password-meter";
import $ from "jquery";
import "./Passwords.css";

const Passwords = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [passwordLength, setPasswordLength] = useState(20);
  const [password, setPassword] = useState("");

  const options = [
    ["numbers", "(0-9)"],
    ["symbols", "(!@#$%^&*)"],
    ["lowercase", "(a-z)"],
    ["uppercase", "(A-Z)"],
  ];

  useEffect(() => {
    $("#passwordInput").val("");
    $("#passwordLength").val("20");
  }, []);

  /* Used to set text of input to generated password */
  useEffect(() => {
    // Change actual input
    $("#passwordInput").val(password);    
  }, [password]);

  const handleLengthChange = (e) => {
    if (e.target.value === undefined || e.target.value === "") {
      setPasswordLength(20);
    } else {
      setPasswordLength(e.target.value);
    }
  };

  const handleInputChange = (e) => {
    setPassword(e.target.value);
    console.log(password);
  };

  const handleClickCheckbox = (e) => {
    if (selectedOptions.includes(e.target.value)) {
      selectedOptions.splice(selectedOptions.indexOf(e.target.value), 1);
      setSelectedOptions([...selectedOptions]);
      console.log(selectedOptions);
    } else {
      selectedOptions.push(e.target.value);
      setSelectedOptions([...selectedOptions]);
      console.log(selectedOptions);
    }
  };

  const toggleHidePassword = (e) => {
    if ($("#passwordInput").attr("type") !== "password") {
      $("#passwordInput").prop("type", "password");
    }
    else {
      $("#passwordInput").prop("type", "text");
    }
  }

  const validate = () => {
    return selectedOptions.length !== 0;
  };

  const generatePassword = () => {
    if (!validate()) {
      $("#errorText").html("Please check at least one option!");
      return;
    }

    $("#errorText").html("");

    const password = generator.generate({
      length: passwordLength,
      numbers: selectedOptions.includes("numbers"),
      symbols: selectedOptions.includes("symbols"),
      lowercase: selectedOptions.includes("lowercase"),
      uppercase: selectedOptions.includes("uppercase"),
    });

    setPassword(password);
  };

  return (
    <div className="passwordsTab">
      <h5>Password Generation/Strength Checker</h5>
      <br />

      <Col m="10" key="length">
        <input
          type="text"
          size="3"
          id="passwordLength"
          onChange={handleLengthChange}
        />
        <span className="checkbox-name">length (default 20)</span>
      </Col>

      {/* <Row> */}
      {options.map((option) => (
        <Col m="10" key={option[0]}>
          <input
            type="checkbox"
            value={option[0]}
            onClick={handleClickCheckbox}
            defaultChecked={false}
          />
          <span className="checkbox-name">{option[0] + " " + option[1]}</span>
        </Col>
      ))}
      {/* </Row> */}

      <br />

      <Input id="passwordInput" type="password" onChange={handleInputChange}></Input>
      <div className="hidePasswordGroup">
        <input id="hidePassword" type="checkbox" defaultChecked={true} onClick={toggleHidePassword} />
        <span className="checkbox-name">Hide Password</span>
      </div>
      <br />
      <StrengthMeter password={password} />
      <br />
      <Button onClick={generatePassword}>Generate Password!</Button>
      <br />
      <br />
      <h5 id="errorText"></h5>
    </div>
  );
};

const StrengthMeter = (props) => {

  const getColor = (strength) => {
    strength = parseFloat(strength)

    if (strength <= 33.0) {
      return "danger"
    }
    else if (strength <= 66.0) {
      return "warning"
    }
    else if (strength <= 99.0) {
      return ""
    }
    else {
      return "success"
    }
  }

  const password = props.password;

  const strength = JSON.stringify(
    new PasswordMeter().getResult(password).percent
  );

  let color = getColor(strength)

  return <Progress value={strength} max={100} id="progressBar" color={color}>{`${strength}%`}</Progress>
};

export default Passwords;
