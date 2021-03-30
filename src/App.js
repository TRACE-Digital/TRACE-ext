import React, { useState } from 'react';
import './App.css';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { Form, Label, Input, FormGroup, Row, Col, Button } from 'reactstrap';
import { tags } from 'trace-search';

import HaveIBeenPwnd from './components/HaveIBeenPwnd.js'

import mainLogo from'./icon.png';

const App = (props) => {
  const [categories, setCategories] = useState([]);
  const [username, setUsername] = useState('');
  const [site, setSite] = useState('');
  const [url, setUrl] = useState('');
  const [showError, setShowError] = useState(false);

  function onSiteChange(e) {
      setShowError(false);
      setSite(e);
  }

  function onUsernameChange(e) {
      setShowError(false);
      setUsername(e); 
  }

  function onUrlChange(e) {
      setShowError(false);
      setUrl(e);
  }

  function handleSubmit(e) {
      console.log(site);
      console.log(username);
      console.log(url);

    if (site && username && url) {
        // Add to database
        setShowError(false);
        props.closePopup();
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

  return (
    <div className="App">
      <img className="logo" alt="TRACE logo" src={mainLogo}></img>
       <Tabs>
        <TabList>
          <Tab style={{fontSize: 14}}>Manage sites</Tab>
          <Tab style={{fontSize: 14}}>Account security</Tab>
        </TabList>

        <TabPanel className="manageSites">
          
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
            </div>
        </TabPanel>

        {/*'Have I Been Pwnd?' tab*/}
        <TabPanel>
          <HaveIBeenPwnd className="haveibeenpwnd" />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default App;
