import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
class Home extends Component {
  render() {
    const { listenerid } = this.props.match.params;

    return (
      <div>
        <div>
          <Link to={"/listeners/"}> Go back</Link>
        </div>{" "}
        <div>
          <Link to={"/listeners/" + listenerid + "/albums"}> All Albums</Link>
        </div>{" "}
        <div>
          <Link to={"/listeners/" + listenerid + "/songs"}> All Songs</Link>
        </div>
        <div>
          <Link to={"/listeners/" + listenerid + "/artists"}> All Artists</Link>
        </div>
        <div>
          <Link to={"/listeners/" + listenerid + "/other-liked-songs"}>
            See Other liked songs
          </Link>
        </div>
        <div>
          <Link to={"/listeners/" + listenerid + "/popular-artist"}>
            Popular Artist
          </Link>
        </div>
        <div>
          <Link to={"/listeners/" + listenerid + "/get-contributers"}>
            Find Contributer with Artist Name
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
