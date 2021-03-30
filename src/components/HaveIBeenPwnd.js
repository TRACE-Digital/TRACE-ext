import React from "react";
import { Form, Input, Label, Button } from "reactstrap";
import { haveIBeenPwnd, validateInput } from "./libhibp.js";

const HaveIBeenPwnd = () => {
  return (
    <div className="pwndTab">
      <h5>Is your data safe?</h5>
      <Form id="form" onSubmit={haveIBeenPwnd}>
        <h6>First, select one of the following:</h6>

        <Input
          type="radio"
          id="email"
          name="typeChoice"
          onClick={validateInput}
        />
        <Label for="email">Email</Label>
        <br />
        <Input
          type="radio"
          id="password"
          name="typeChoice"
          onClick={validateInput}
        />
        <Label for="password">Password</Label>
        <br />
        <br />

        <Input
          id="entry"
          name="entry"
          placeholder="Enter Email/Password"
          onInput={validateInput}
          disabled
        />
        <br />
        <br />

        <Button type="submit" className="searchButton" disabled>
          Check for breaches!
        </Button>
      </Form>

      <br />
      <div className="responseBody"></div>
    </div>
  );
};

export default HaveIBeenPwnd;
