import React, { Component } from "react";
import {
  withRouter,
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

class ArtistDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: null,
      songs: null,
    };
  }
  getAlbums = (artistid) => {
    const { listenerid } = this.props.match.params;

    fetch(`/api/listeners/${listenerid}/artists/${artistid}/albums`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ albums: data });
      });
  };

  getSongs = (artistid) => {
    const { listenerid } = this.props.match.params;

    fetch(`/api/listeners/${listenerid}/artists/${artistid}/songs`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ songs: data });
      });
  };

  getArtist = (artistid) => {
    fetch(`/api/artists/${artistid}/`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          artist: Array.isArray(data) && data.length && data[0],
        });
      });
  };

  componentDidMount() {
    const { artistid } = this.props.match.params;
    this.getAlbums(artistid);
    this.getSongs(artistid);
    this.getArtist(artistid);
  }
  render() {
    const { albums, songs, artist } = this.state;
    const { artistid } = this.props.match.params;

    return (
      <div>
        <div>
          Artist Name:{" "}
          {artist && artist.firstname + " " + artist && artist.lastname}
        </div>
        <div>
          Album List
          <table style={{ width: "100%" }}>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Action</th>
            </tr>

            {albums
              ? albums.map((e) => (
                  <tr>
                    <td>{e.title || ""}</td>
                    <td>{e.genre || ""}</td>
                    <td>
                      <Link to={`/artists/${artistid}/albums/${e.id}`}>
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              : null}
          </table>
        </div>
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

export default withRouter(ArtistDetail);
