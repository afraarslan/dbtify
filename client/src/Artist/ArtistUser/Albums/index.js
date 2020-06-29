import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { Component } from "react";
import List from "./List";
import UpdateAlbum from "../UpdateAlbum";

function Albums(props) {
  return (
    <div>
      <div>Albums</div>
      <Switch>
        <Route exact path="/artists/:artistid/albums/:albumid">
          <List />
        </Route>
        <Route exact path="/artists/:artistid/albums/:albumid/update">
          <UpdateAlbum />
        </Route>
      </Switch>
    </div>
  );
}

export default Albums;
