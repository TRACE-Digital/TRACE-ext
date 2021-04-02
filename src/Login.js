import React, { useState } from "react";
import { Auth } from 'aws-amplify';

import { Card, CardImg, CardBody, Button, Form, FormGroup, Input } from 'reactstrap';

import mainLogo from'./icon.png';

async function signIn(username, password) {
    try {
        await Auth.signIn(username, password);
        return null;
    } catch (error) {
      Auth.error = error;
      console.log('error signing in', error.message);
      return error.message;
    }
}

function Login() {
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

  return (
    <div className="login">
        {/* Log In */}
        <Card style={{width: '30rem'}}>
            <CardImg top src={mainLogo} alt="trace logo"/>
            <CardBody>
                <Form id='sign-in-form'  onSubmit={async (e) => {
                  e.preventDefault();
                  let localError = false;
                  localError = await signIn(email, password);
                  setError(localError);
                }}>
                  {loginFields}
                </Form>
                <Button color="primary" block type="submit" form='sign-in-form' >
                  Log In
                </Button>
                <br/>
            </CardBody>
        </Card>
    </div>
  );
}

export default Login;