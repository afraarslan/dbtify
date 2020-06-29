import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { Component } from "react";
import Create from "./Create";
import Home from "./Home";
import Albums from "./Albums/index";

function ArtistUser(props) {
  return (
    <div>
      <Switch>
        <Route path="/artists/:artistid/create">
          <Create />
        </Route>
        <Route exact path="/artists/:artistid">
          <Home />
        </Route>

        <Route path="/artists/:artistid/albums">
          <Albums />
        </Route>
      </Switch>
    </div>
  );
}

export default ArtistUser;
