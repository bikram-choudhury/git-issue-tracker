import React, { useEffect, useState } from 'react';
import { Nav, Alert } from 'react-bootstrap';
import Axios from 'axios';
import './App.css';
import ListIssues from './ListIssues';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import IssueDetails from './IssueDetails';

function App() {

  const [ownerName, setOwnerName] = useState('');
  const [repoName, setRepoName] = useState('');
  const [fullRepoName, setFullRepoName] = useState('');
  const [openIssueCount, setOpenIssueCount] = useState(0);

  useEffect(() => {
    const URL = `https://api.github.com/repos/angular/angular`;
    Axios.get(URL).then(response => {

      const { full_name, name, owner: { login }, open_issues_count } = response.data;

      setOwnerName(login);
      setRepoName(name);
      setOpenIssueCount(open_issues_count);
      setFullRepoName(full_name);

    }).catch(error => console.log(error))
  }, []);

  return (
    <div className="App">
      <Alert variant="warning">Pagination is not completed</Alert>
      <h4>{ownerName}/{repoName}</h4>

      <Nav variant="tabs" defaultActiveKey="/issues">
        <Nav.Item style={{ width: "100px" }}>
          <Nav.Link href="/issues">Issues</Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="issue-wrapper">
        <Router>
          <Route exact path="/" render={() => <ListIssues repoName={fullRepoName} />} />
          <Route path="/issues/:issueId" render={(props) => <IssueDetails {...props} repoName={fullRepoName} />} />
        </Router>
      </div>

    </div>
  );
}

export default App;
