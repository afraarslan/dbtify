import {
  BrowserRouter as Router,
  Switch,
  withRouter,
  Route,
  Link,
} from "react-router-dom";
import React, { Component } from "react";
import MultipleValueTextInput from "react-multivalue-text-input";

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      genre: "",
      songs: [],
      contributers: [],
    };
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

        <div>Album Create</div>

        <input name="title" placeholder="title" onChange={this.handleChange} />
        <input name="genre" placeholder="genre" onChange={this.handleChange} />

        <MultipleValueTextInput
          onItemAdded={(item, allItems) => this.setState({ songs: allItems })}
          onItemDeleted={(item, allItems) => this.setState({ songs: allItems })}
          label="Add Songs"
          name="item-input"
          placeholder="Add songs and hit enter...."
        />

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
          onClick={async () => {
            const { title, genre, songs, contributers: raw } = this.state;
            let contributers = [];
            raw.map((e) => {
              var firstname = e.split(" ").slice(0, -1).join(" ");
              var lastname = e.split(" ").slice(-1).join(" ");
              contributers.push({ firstname, lastname });
            });

            const opt = {
              title,
              genre,
              songs,
              contributers,
            };
            // console.log("KML: Create -> render -> opt", opt);
            const res = await fetch(
              "/api/artists/" + artistid + "/albums/add",
              {
                method: "post",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(opt),
              }
            );
            if (res) {
              window.location = "/artists/" + artistid;
            }
          }}
        >
          Create Album
        </button>
      </div>
    );
  }
}
export default withRouter(Create);
