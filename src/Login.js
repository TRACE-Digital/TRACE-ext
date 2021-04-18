import React, { useState, useRef } from "react";
import './Login.css';

import { Auth } from 'aws-amplify';
import { Card, CardImg, CardBody, Button, Form, FormGroup, Input } from 'reactstrap';
import mainLogo from'./trace.png';

async function signIn(username, password) {
    try {
        await Auth.signIn(username, password);
    } catch (error) {
      Auth.error = error;
      console.log('error signing in', error.message);
      return error.message;
    }
}

const Login = (props) => {
  let btnRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const loginFields = (
    <>
      <FormGroup>
        <Input
          placeholder="Email"
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </FormGroup>
    </>
  )

  function handleLogIn(e) {
    if(btnRef.current){
      btnRef.current.setAttribute("disabled", "disabled");
    }
  }

  return (
    <div className="login">
        {/* Log In */}
        <Card>
            <div className="logo">
              <CardImg top src={mainLogo} alt="trace logo" />
            </div>
            <CardBody>
                <div className={error ? "error-message-visible" : "error-not-visible"}>
                    { error ? "Error: " + error : ""}
                </div>
                <Form id='sign-in-form'  onSubmit={async (e) => {
                  e.preventDefault();
                  let localError = false;
                  localError = await signIn(email, password);
                  setError(localError);
                  if (!localError) {
                    console.log("no error");
                    props.onLogin(true);
                  };
                }}>
                  {loginFields}
                </Form>
                <Button color="primary" block type="submit" form='sign-in-form' onClick={handleLogIn}>
                  Log In
                </Button>
                <br/>
                <a href="https://tracedigital.tk/signup" target="_blank" rel="noreferrer">
                    Don't have an account? Create Account
                </a>
            </CardBody>
        </Card>
    </div>
  );
}

export default Login;