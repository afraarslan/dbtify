import React, { Component } from "react";
import {
  withRouter,
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

class OtherLiked extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }
  getData = () => {
    const { listenerid } = this.props.match.params;

    fetch(`/api/listeners/${listenerid}/others-liked-songs`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ data });
      });
  };

  componentDidMount() {
    this.getData();
  }
  render() {
    const { data } = this.state;
    const { listenerid } = this.props.match.params;
    if (!Array.isArray(data)) return null;

    return (
      <div>
        <Link to={`/listeners/` + listenerid}> Go back</Link>

        <div>
          Liked Songs
          <table style={{ width: "100%" }}>
            <tr>
              <th>Username</th>
              <th>Title</th>
            </tr>

            {data
              ? data.map((e) => (
                  <tr>
                    <td>{e.username || ""}</td>
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

export default withRouter(OtherLiked);
