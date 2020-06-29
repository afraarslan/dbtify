import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
class Albums extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      likeds: [],
    };
  }

  componentDidMount() {
    this.getAlbumDetail();
    this.fetchLikedAlbums();
  }

  getAlbumDetail = () => {
    const { listenerid } = this.props.match.params;

    fetch("/api/listeners/" + listenerid + "/albums")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ data });
      });
  };

  async fetchLikedAlbums() {
    const { listenerid } = this.props.match.params;

    fetch("/api/listeners/" + listenerid + "/liked-albums")
      .then((response) => response.json())
      .then((data) => {
        console.log("KML: Songs -> fetchLikedAlbums -> data", data);
        this.setState({ likeds: data });
      });
  }

  like(id) {
    const { listenerid } = this.props.match.params;

    fetch("/api/listeners/" + listenerid + "/liked-albums/" + id)
      .then((response) => response.json())
      .then((data) => {
        console.log("KML: Songs -> like -> data", data);
        this.fetchLikedAlbums();
      });
  }
  unlike(id) {
    const { listenerid } = this.props.match.params;

    fetch("/api/listeners/" + listenerid + "/unliked-albums/" + id)
      .then((response) => response.json())
      .then((data) => {
        console.log("KML: Songs -> unlike -> data", data);
        this.fetchLikedAlbums();
      });
  }

  render() {
    const { data, likeds } = this.state;
    const { listenerid } = this.props.match.params;

    if (!data) return null;
    return (
      <div>
        All Albums
        <div>
          <Link to={"/listeners/" + listenerid}> Return to listener</Link>
        </div>{" "}
        <table style={{ width: "100%" }}>
          <tr>
            <th>Title</th>
            <th>Genre</th>
            <th>Action</th>
          </tr>
          {data
            ? data.map((e) => (
                <tr>
                  <td>{e.title || ""}</td>
                  <td>{e.genre || ""}</td>
                  <td>
                    <Link to={`/listeners/${listenerid}/albums/${e.id}`}>
                      {" "}
                      Detail
                    </Link>
                    {likeds.includes(e.id) ? (
                      <div>
                        <b>LIKED</b>
                      </div>
                    ) : (
                      <button onClick={() => this.like(e.id)}>
                        <b>Like</b>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            : null}
        </table>
      </div>
    );
  }
}

export default withRouter(Albums);
