import React, { Component } from "react";
import {
  withRouter,
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

class PopularArtist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }
  getData = () => {
    const { listenerid } = this.props.match.params;

    fetch(`/api/listeners/${listenerid}/popular-artists`)
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
          Popular Artists
          <table style={{ width: "100%" }}>
            <tr>
              <th>Count</th>
              <th>Name</th>
            </tr>

            {data
              ? data.map((e) => (
                  <tr>
                    <td>{e.count || ""}</td>
                    <td>{e.firstname || "" + e.lastname || ""}</td>
                  </tr>
                ))
              : null}
          </table>
        </div>
      </div>
    );
  }
}

export default withRouter(PopularArtist);
