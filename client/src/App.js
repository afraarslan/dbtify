import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Artists from "./Artist/index";
import Listeners from "./Listeners/index";

export default class App extends Component {
  render() {
    return (
      <div style={{ padding: 30 }}>
        <Router>
          <Switch>
            <Route path="/artists">
              <Artists></Artists>
            </Route>

            <Route path="/listeners">
              <Listeners></Listeners>
            </Route>

            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/artists">ARTIST</Link>
          </li>
          <li>
            <Link to="/listeners">LISTERNER</Link>
          </li>
        </ul>
        <h2> WELCOME TO DBTIFY</h2>
      </div>
    );
  }
}
