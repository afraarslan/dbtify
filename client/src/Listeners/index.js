import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Home from "./Home";
import ListenerUser from "./ListenerUser/index";

class Listener extends Component {
  render() {
    return (
      <div>
        <h2>Listeners</h2>

        <Switch>
          <Route path="/listeners/:listenerid">
            <ListenerUser />
          </Route>

          <Route exact path="/listeners">
            <Home />
          </Route>
        </Switch>
      </div>
    );
  }
}
export default Listener;
