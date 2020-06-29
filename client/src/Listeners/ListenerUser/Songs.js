import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";

class Songs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      likeds: [],
      genres: [],
      searchData: [],
      filtered: [],
      mode: "normal",
      searchText: "",
      filteredText: "",
    };
  }

  componentDidMount() {
    this.getAlbumDetail();
    this.fetchLikedSongs();
    this.fetchGenre();
  }

  getAlbumDetail = () => {
    const { listenerid } = this.props.match.params;

    fetch("/api/listeners/" + listenerid + "/songs")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ data });
      });
  };

  async fetchLikedSongs() {
    const { listenerid } = this.props.match.params;

    fetch("/api/listeners/" + listenerid + "/liked-songs")
      .then((response) => response.json())
      .then((data) => {
        console.log("KML: Songs -> fetchLikedSongs -> data", data);
        this.setState({ likeds: data });
      });
  }

  async fetchGenre() {
    fetch("/api/listeners/genres")
      .then((response) => response.json())
      .then((data) => {
        console.log("KML: Songs -> fetchLikedSongs -> data", data);
        this.setState({ genres: data });
      });
  }

  filterGenre(q) {
    fetch(`/api/listeners/genres?q=${q}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("KML: Songs -> filterGenre -> data", data);
        this.setState({
          filtered: data ? data.songs : [],
          filteredText: data ? data.q : "",
        });
        this.fetchLikedSongs();
      });
  }
  like(id) {
    const { listenerid } = this.props.match.params;

    fetch("/api/listeners/" + listenerid + "/liked-songs/" + id)
      .then((response) => response.json())
      .then((data) => {
        console.log("KML: Songs -> like -> data", data);
        this.fetchLikedSongs();
      });
  }
  unlike(id) {
    const { listenerid } = this.props.match.params;

    fetch("/api/listeners/" + listenerid + "/unliked-songs/" + id)
      .then((response) => response.json())
      .then((data) => {
        console.log("KML: Songs -> unlike -> data", data);
        this.fetchLikedSongs();
      });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  searchText() {
    const { listenerid } = this.props.match.params;

    fetch(
      "/api/listeners/" +
        listenerid +
        "/songs/search?q=" +
        this.state.searchText
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({ searchData: data });
        console.log("KML: Songs -> unlike -> data", data);
        this.fetchLikedSongs();
      });
  }
  render() {
    const {
      data: datas,
      likeds,
      genres,
      mode,
      filteredText,
      searchData,
      filtered,
    } = this.state;
    const { listenerid } = this.props.match.params;

    const data =
      mode === "filter" ? filtered : mode === "search" ? searchData : datas;
    const title =
      mode === "filter"
        ? "Filtered Mode Songs"
        : mode === "search"
        ? "Search Result"
        : "All Songs";

    if (!Array.isArray(data)) return null;
    return (
      <div>
        All Songs
        <div>
          <Link to={"/listeners/" + listenerid}> Return to listener</Link>
        </div>{" "}
        <button
          disabled={mode === "normal"}
          onClick={() => this.setState({ mode: "normal" })}
        >
          Normal Mode
        </button>
        <button
          disabled={mode === "filter"}
          onClick={() => this.setState({ mode: "filter" })}
        >
          Filter Mode
        </button>
        <button
          disabled={mode === "search"}
          onClick={() => this.setState({ mode: "search" })}
        >
          Search Mode
        </button>
        {mode === "search" ? (
          <div>
            <input name="searchText" onChange={this.handleChange}></input>

            <button onClick={() => this.searchText()}>Search Song</button>
          </div>
        ) : null}
        <h3>{title}</h3>
        {mode === "filter" &&
          genres.map((e) => (
            <button
              style={{
                padding: 10,
                backgroundColor: filteredText === e ? "#b6eb7a" : "#f7f7ee",
              }}
              onClick={() => this.filterGenre(e)}
            >
              {e}
            </button>
          ))}
        <table style={{ width: "100%" }}>
          <tr>
            <th>Title</th>
            <th>Action</th>
          </tr>
          {data.map((e) => {
            return (
              <tr>
                <td>{e.title || ""}</td>

                <td>
                  {likeds.includes(e.id) ? (
                    <button onClick={() => this.unlike(e.id)}>Unlike</button>
                  ) : (
                    <button onClick={() => this.like(e.id)}>
                      <b>Like</b>
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    );
  }
}

export default withRouter(Songs);
