import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/listeners")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  return (
    <div>
      <Link to={"/"}>Return home</Link>
      Chose an Listeners to simulate authentication
      {data.map((e) => (
        <div>
          <Link to={"/listeners/" + e.id}>
            {e.username + " | " + e.email} => Go to Listener
          </Link>
        </div>
      ))}
    </div>
  );
}
export default Home;
