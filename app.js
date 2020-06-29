const dotenv = require("dotenv");

const express = require("express");
const app = express();
const port = 3000;
const mysql = require("./mysql");
const path = require("path");
const logger = require("morgan");

var bodyParser = require("body-parser");
app.use(bodyParser.json());

const routes = require("./routes");

// app.set("view engine", "pug");
app.use(logger("dev"));

app.use("/api", routes);

// Serve any static files
app.use(express.static(path.join(__dirname, "client/build")));
// Handle React routing, return all requests to React app
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
