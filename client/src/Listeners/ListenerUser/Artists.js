import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
class Artists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    this.getAlbumDetail();
  }

  getAlbumDetail = () => {
    const { listenerid } = this.props.match.params;

    fetch("/api/listeners/" + listenerid + "/artists")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ data });
      });
  };

  render() {
    const { listenerid } = this.props.match.params;
    const { data } = this.state;
    if (!data) return null;
    return (
      <div>
        All Albums
        <div>
          <Link to={"/listeners/" + listenerid}> Return to listener</Link>
        </div>{" "}
        <table style={{ width: "100%" }}>
          <tr>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Action</th>
          </tr>
          {data
            ? data.map((e) => (
                <tr>
                  <td>{e.firstname || ""}</td>
                  <td>{e.lastname || ""}</td>

                  <td>
                    <Link to={`/listeners/${listenerid}/artists/${e.id}`}>
                      {" "}
                      Detail
                    </Link>
                    <Link
                      to={`/listeners/${listenerid}/artists/${e.id}/popular-songs`}
                    >
                      {" "}
                      Popular Songs
                    </Link>
                  </td>
                </tr>
              ))
            : null}
        </table>
      </div>
    );
  }
}

export default withRouter(Artists);
