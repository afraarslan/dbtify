import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function ArtistHome() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetch("/api/artists")
      .then((response) => response.json())
      .then((data) => {
        setArtists(data);
      });
  }, []);
  return (
    <div>
      <Link to={"/"}>Return home</Link>
      Chose an artist to simulate authentication
      {artists.map((e) => (
        <div>
          <Link to={"/artists/" + e.id}>
            {e.firstname + " " + e.lastname} => Go to Artist
          </Link>
        </div>
      ))}
    </div>
  );
}
export default ArtistHome;
