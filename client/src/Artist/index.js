import ArtistHome from "./ArtistHome";
import ArtistUser from "./ArtistUser";
import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class Artists extends Component {
  render() {
    return (
      <div>
        <h2>Artists</h2>

        <Switch>
          <Route path="/artists/:artistid">
            <ArtistUser />
          </Route>

          <Route path="/artists">
            <ArtistHome />
          </Route>
        </Switch>
      </div>
    );
  }
}
export default Artists;
