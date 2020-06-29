import React, { Component } from "react";
import {
  withRouter,
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

class AlbumDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      album: null,
      songs: null,
    };
  }
  getAlbum = (albumid) => {
    const { listenerid } = this.props.match.params;

    fetch(`/api/listeners/${listenerid}/albums/${albumid}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ album: data });
      });
  };

  getSongs = (albumid) => {
    const { listenerid } = this.props.match.params;

    fetch(`/api/listeners/${listenerid}/albums/${albumid}/songs`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ songs: data });
      });
  };

  componentDidMount() {
    const { albumid } = this.props.match.params;
    this.getAlbum(albumid);
    this.getSongs(albumid);
  }
  render() {
    const { album, songs } = this.state;
    const { listenerid } = this.props.match.params;

    return (
      <div>
        <Link to={`/listeners/${listenerid}/albums`}> Go back</Link>

        {album ? (
          <div>album Title: {album.title + " | Genre:" + album.genre}</div>
        ) : null}

        <div>
          Song List
          <table style={{ width: "100%" }}>
            <tr>
              <th>Id</th>
              <th>Title</th>
            </tr>

            {songs
              ? songs.map((e) => (
                  <tr>
                    <td>{e.id || ""}</td>
                    <td>{e.title || ""}</td>
                  </tr>
                ))
              : null}
          </table>
        </div>
      </div>
    );
  }
}

export default withRouter(AlbumDetail);
