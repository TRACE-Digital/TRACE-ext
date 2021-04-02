import React, { useEffect, useState } from 'react';
import './App.css';

import Amplify from 'aws-amplify';
import { Auth } from 'aws-amplify';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { Form, Label, Input, FormGroup, Row, Col, Button } from 'reactstrap';
import { tags, ManualAccount } from 'trace-search';

import mainLogo from'./icon.png';
import Login from './Login.js';
import configuration from './amplify_config.js';

const App = (props) => {
  const [categories, setCategories] = useState([]);
  const [username, setUsername] = useState('');
  const [siteName, setSiteName] = useState('');
  const [url, setUrl] = useState('');
  const [showError, setShowError] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    Amplify.configure(configuration);
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const user = await Auth.currentUserPoolUser();
        console.log(user);
        try {
          const smallerCognitoUser = user.signInUserSession.idToken
          localStorage.setItem("trace-user", JSON.stringify(smallerCognitoUser, null, 0));
          console.log(JSON.stringify(smallerCognitoUser, null, 0))
        } catch (e) {
          console.log(e);
        }
        setIsLoggedIn(true);
      }
      catch {
        setIsLoggedIn(false);
      }
    })();
  });

  function onSiteChange(e) {
      setShowError(false);
      setDbError(null);
      setSiteName(e);
  }

  function onUsernameChange(e) {
      setShowError(false);
      setDbError(null);
      setUsername(e); 
  }

  function onUrlChange(e) {
      setShowError(false);
      setDbError(null);
      setUrl(e);
  }

  function clearInputs() {
    var inputs = document.getElementsByTagName('input');

    for(var i = 0; i < inputs.length; i++) {
        if(inputs[i].type.toLowerCase() == 'text') {
          inputs[i].value = '';
        } else if(inputs[i].type.toLowerCase() == 'checkbox') {
          inputs[i].checked = false;
        }
    }

    setSiteName('');
    setUsername('');
    setUrl('');
    setCategories([]);
}

  async function handleSubmit(e) {
      console.log(siteName);
      console.log(username);
      console.log(url);

    if (siteName && username && url) {
        setShowError(false);
        // Add to database
        const manualSite = { url: url, name: siteName, tags: categories };
        const manualAccount = new ManualAccount(manualSite, username);

      try {
        await manualAccount.save();
        clearInputs();
      } catch (e) {
        if (e.message === "Document update conflict") {
          setDbError("Account already exists");
        } else {
          setDbError(e.message);
        }
      }
    }
    else {
        setShowError(true);
    }
    console.log(showError);
  }

  function handleClickCheckbox(e) {
    console.log(e.target.value);

    if (categories.includes(e.target.value)) {
        categories.splice(categories.indexOf(e.target.value), 1);
        setCategories([...categories]);
        console.log(categories);
    }
    else {
        categories.push(e.target.value);
        setCategories([...categories]);
        console.log(categories);
    }
  }

  if (isLoggedIn) {
    return (
      <div className="App">
        <img className="logo" src={mainLogo}></img>
        <Tabs>
          <TabList>
            <Tab style={{fontSize: 14}}>Manage sites</Tab>
            <Tab style={{fontSize: 14}}>Account security</Tab>
          </TabList>

          <TabPanel>
            
            <h5 className="tab-title">Add new site</h5>
            <div className="form-container">
            <Form>
              <Row>
                <Col md={6} xs={6}>
                  <FormGroup className="form-group">
                      <Label for="siteName" className="label">Site Name</Label><span className="asterisk">*</span>
                      <Input type="text" name="site" id="input" placeholder="eg. Instagram" onChange={(e) => onSiteChange(`${e.target.value}`)}/>
                  </FormGroup>
                </Col>
                <Col md={6} xs={6}>
                  <FormGroup className="form-group">
                      <Label for="username" className="label">Username</Label><span className="asterisk">*</span>
                      <Input type="text" name="username" id="input" placeholder="eg. coraychan" onChange={(e) => onUsernameChange(`${e.target.value}`)}/>
                  </FormGroup>
                </Col>
              </Row>
                  <FormGroup className="form-group">
                      <Label for="siteUrl" className="label">Account URL</Label><span className="asterisk">*</span>
                      <Input type="text" name="url" id="input" placeholder="eg. www.instagram.com/coraychan" onChange={(e) => onUrlChange(`${e.target.value}`)}/>
                  </FormGroup>
                  <Label for="tags" className="label">Tags</Label>
                  <Row>
                      {tags.map(tag => (
                          <Col xs="4" key={tag}>
                              <input
                                  type="checkbox"
                                  value={tag}
                                  onClick={handleClickCheckbox}
                                  defaultChecked={false}
                              />
                              <span className="checkbox-name">{tag}</span>
                          </Col>
                      ))}
                  </Row>
              </Form>
              </div>
              <div className="add-button-container">
                  <Button style={{fontSize: 14}} onClick={handleSubmit}>
                      Add to Dashboard
                  </Button>
                  <div className={showError ? "error-message-visible" : "error-not-visible"}>
                      Warning: required fields are empty
                  </div>
                  <div className={dbError ? "error-message-visible" : "error-not-visible"}>
                      { dbError ? "Error: " + dbError : ""}
                  </div>
              </div>
          </TabPanel>

          {/*'Have I Been Pwnd?' tab*/}
          <TabPanel>
            <h2>Is your data safe?</h2>
          </TabPanel>
        </Tabs>
      </div>
    );
  } else {
    return (
      <Login/>
    );
  }
}

export default App;
