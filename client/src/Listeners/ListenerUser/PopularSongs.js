import React, { Component } from "react";
import {
  withRouter,
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

class PopularSongs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }
  getData = () => {
    const { artistid, listenerid } = this.props.match.params;

    fetch(`/api/listeners/${listenerid}/artists/${artistid}/popular-songs`)
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
          Popular songs
          <table style={{ width: "100%" }}>
            <tr>
              <th>Count</th>
              <th>Song Title</th>
            </tr>

            {data
              ? data.map((e) => (
                  <tr>
                    <td>{e.count || ""}</td>
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

export default withRouter(PopularSongs);
