import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Songs from "./Songs";
import Albums from "./Albums";
import Home from "./Home";
import Artists from "./Artists";
import ArtistDetail from "./ArtistDetail";
import AlbumDetail from "./AlbumDetail";
import OtherLiked from "./OtherLiked";
import PopularArtist from "./PopularArtist";
import PopularSongs from "./PopularSongs";
import Contributer from "./Contributer";

class ListenerUser extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path={`/listeners/:listenerid/songs`}>
            <Songs />
          </Route>

          <Route path={`/listeners/:listenerid/popular-artist`}>
            <PopularArtist />
          </Route>

          <Route path={`/listeners/:listenerid/other-liked-songs`}>
            <OtherLiked />
          </Route>
          <Route path={`/listeners/:listenerid/get-contributers`}>
            <Contributer />
          </Route>

          <Route exact path={`/listeners/:listenerid/albums`}>
            <Albums />
          </Route>

          <Route path={`/listeners/:listenerid/albums/:albumid`}>
            <AlbumDetail />
          </Route>

          <Route exact path={`/listeners/:listenerid/artists`}>
            <Artists />
          </Route>
          <Route exact path={`/listeners/:listenerid/artists/:artistid`}>
            <ArtistDetail />
          </Route>
          <Route
            exact
            path={`/listeners/:listenerid/artists/:artistid/popular-songs`}
          >
            <PopularSongs />
          </Route>

          <Route exact path={`/listeners/:listenerid`}>
            <Home />
          </Route>
        </Switch>
      </div>
    );
  }
}
export default ListenerUser;
