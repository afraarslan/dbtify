import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import React, { Component } from "react";

class Update extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      genre: "",
    };
  }

  getAlbumDetail = () => {
    const { artistid, albumid } = this.props.match.params;

    fetch("/api/artists/" + artistid + "/albums/" + albumid)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.album && data.album.length) {
          this.setState({
            title: data.album[0].title,
            genre: data.album[0].genre,
          });
        }
      });
  };

  componentDidMount() {
    this.getAlbumDetail();
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { artistid } = this.props.match.params;

    return (
      <div>
        <div>
          <Link to={"/artists/" + artistid}>Return to Albums</Link>
        </div>

        <div>Album Update</div>

        <input
          name="title"
          value={this.state.title}
          placeholder="title"
          onChange={this.handleChange}
        />
        <input
          name="genre"
          value={this.state.genre}
          placeholder="genre"
          onChange={this.handleChange}
        />

        <button
          onClick={async () => {
            const { title, genre } = this.state;

            const { albumid, artistid } = this.props.match.params;

            const opt = {
              title,
              genre,
            };
            console.log("KML: Update -> render -> opt", opt);
            const res = await fetch(
              `/api/artists/${artistid}/albums/${albumid}/update`,
              {
                method: "post",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(opt),
              }
            );
            if (res) {
              this.props.history.push("/artists/" + artistid);
            }
          }}
        >
          Update Album
        </button>
      </div>
    );
  }
}
export default withRouter(Update);
