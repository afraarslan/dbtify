import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import React, { Component } from "react";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: null,
    };
  }
  componentDidMount() {
    this.fetchAlbumDatas();
  }
  fetchAlbumDatas = () => {
    const { artistid } = this.props.match.params;

    fetch("/api/artists/" + artistid + "/albums")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ albums: data });
      });
  };

  deleteAlbum = async (id) => {
    const { artistid } = this.props.match.params;

    const res = await fetch(
      "/api/artists/" + artistid + "/albums/" + id + "/delete"
    );
    if (res) {
      this.fetchAlbumDatas(id);
    }
  };

  render() {
    const { artistid } = this.props.match.params;

    return (
      <div>
        Album List
        <div>
          <Link to={"/artists/"}>Return back</Link>
        </div>
        <div>
          <Link to={"/artists/" + artistid + "/create"}>Create New Album</Link>
        </div>
        <table style={{ width: "100%" }}>
          <tr>
            <th>Title</th>
            <th>Genre</th>
            <th>Action</th>
          </tr>
          {this.state.albums
            ? this.state.albums.map((e) => (
                <tr>
                  <td>{e.title || ""}</td>
                  <td>{e.genre || ""}</td>
                  <td>
                    <Link to={`/artists/${artistid}/albums/${e.id}`}>
                      Detail
                    </Link>

                    <Link to={`/artists/${artistid}/albums/${e.id}/update`}>
                      {" "}
                      Update
                    </Link>

                    <button onClick={() => this.deleteAlbum(e.id)}>
                      Delete Album
                    </button>
                  </td>
                </tr>
              ))
            : null}
        </table>
      </div>
    );
  }
}

export default withRouter(Home);
