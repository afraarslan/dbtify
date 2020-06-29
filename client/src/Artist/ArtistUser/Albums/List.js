import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import MultipleValueTextInput from "react-multivalue-text-input";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      album: null,
      songs: [],
      title: "",
      updateModeId: null,
      contributers: [],
    };
  }

  getAlbumDetail = () => {
    const { artistid, albumid } = this.props.match.params;

    fetch("/api/artists/" + artistid + "/albums/" + albumid)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ album: data.album, songs: data.songs });
      });
  };

  componentDidMount() {
    this.getAlbumDetail();
  }
  deleteSong = async (id) => {
    const { artistid } = this.props.match.params;

    const res = await fetch(
      "/api/artists/" + artistid + "/songs/" + id + "/delete"
    );
    if (res) {
      this.getAlbumDetail();
    }
  };
  add = async (albumId, title) => {
    const { artistid } = this.props.match.params;
    const { contributers: raw } = this.state;
    let contributers = [];
    raw.map((e) => {
      var firstname = e.split(" ").slice(0, -1).join(" ");
      var lastname = e.split(" ").slice(-1).join(" ");
      contributers.push({ firstname, lastname });
    });
    const res = await fetch(`/api/artists/${artistid}/albums/${albumId}/add`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, contributers }),
    });
    if (res) {
      console.log("KML: List -> res", res);
      this.getAlbumDetail();
    }
  };

  addSong(albumId, title) {
    this.add(albumId, title);
  }
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    const { artistid } = this.props.match.params;
    const { album: rawAlbum, updateModeId, newtitle } = this.state;
    const album =
      Array.isArray(rawAlbum) && rawAlbum.length ? rawAlbum[0] : null;
    return (
      <div>
        {album ? (
          <div>
            <div>
              <b>
                {" "}
                Album Id :{album.id}
                <br></br>
                Album Title :{album.title}
                <br></br>
                Album Genre :{album.genre}
                <br></br>
              </b>
            </div>
            <div>
              <Link to={"/artists/" + artistid}>Return to Albums</Link>
            </div>
            <div>
              <div>Create Song</div>
              <input name="title" onChange={this.handleChange} />
              <MultipleValueTextInput
                onItemAdded={(item, allItems) =>
                  this.setState({ contributers: allItems })
                }
                onItemDeleted={(item, allItems) =>
                  this.setState({ contributers: allItems })
                }
                label="Contributers"
                name="item-input"
                placeholder="Add contributer firstname lastname together"
              />

              <button
                onClick={async () => this.addSong(album.id, this.state.title)}
              >
                {" "}
                Create song
              </button>
            </div>
            <div>
              <table style={{ width: "100%" }}>
                <tr>
                  <th>Title</th>
                  <th>Action</th>
                </tr>
                {this.state.songs
                  ? this.state.songs.map((e) => (
                      <tr>
                        {updateModeId === e.id ? (
                          <td>
                            <input
                              value={newtitle}
                              style={{ minWidth: 300 }}
                              name="newtitle"
                              onChange={(e) => {
                                this.setState({ newtitle: e.target.value });
                              }}
                            ></input>
                          </td>
                        ) : (
                          <td>{e.title || ""}</td>
                        )}

                        <td>
                          <button
                            style={{
                              backgroundColor:
                                updateModeId === e.id ? "#b6eb7a" : "#f7f7ee",
                            }}
                            onClick={
                              updateModeId === e.id
                                ? async () => {
                                    const res = await fetch(
                                      `/api/artists/${artistid}/songs/${e.id}/update`,
                                      {
                                        method: "post",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                          title: this.state.newtitle,
                                        }),
                                      }
                                    );
                                    if (res) {
                                      this.getAlbumDetail();
                                      this.setState({ updateModeId: null });
                                    }
                                  }
                                : () =>
                                    this.setState({
                                      updateModeId: e.id,
                                      newtitle: e.title,
                                    })
                            }
                          >
                            {updateModeId === e.id
                              ? "Save Changes"
                              : "Update Song"}
                          </button>

                          <button onClick={() => this.deleteSong(e.id)}>
                            Delete Song
                          </button>
                        </td>
                      </tr>
                    ))
                  : null}
              </table>
            </div>
          </div>
        ) : (
          <div> loading..........</div>
        )}
      </div>
    );
  }
}

export default withRouter(List);
