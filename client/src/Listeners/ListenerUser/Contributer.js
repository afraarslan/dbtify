import React, { Component } from "react";
import {
  withRouter,
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

class Contributer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      firstname: "",
      lastname: "",
    };
  }
  getData = async () => {
    const { listenerid } = this.props.match.params;
    const { firstname, lastname } = this.state;
    fetch(`/api/listeners/${listenerid}/get-contributers`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: firstname ? firstname.trim() : null,
        lastname: lastname ? lastname.trim() : null,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ data: data[0] });
      });
  };

  componentDidMount() {
    this.getData();
  }
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    const { data } = this.state;
    const { listenerid } = this.props.match.params;
    if (!Array.isArray(data)) return null;

    return (
      <div>
        <Link to={`/listeners/` + listenerid}> Go back</Link>
        <div>
          <input name="firstname" onChange={this.handleChange}></input>
          <input name="lastname" onChange={this.handleChange}></input>

          <button onClick={this.getData}>Search</button>
        </div>
        <div>
          Contributers
          <table style={{ width: "100%" }}>
            <tr>
              <th>firstname</th>
              <th>lastname</th>
            </tr>

            {data
              ? data.map((e) => (
                  <tr>
                    <td>{e.firstname || ""}</td>
                    <td>{e.lastname || ""}</td>
                  </tr>
                ))
              : null}
          </table>
        </div>
      </div>
    );
  }
}

export default withRouter(Contributer);
