var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootMysql",
  database: "dbtify",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to db!");
});

exports.query = async function query(sql, args) {
  return new Promise((resolve, reject) => {
    con.query(sql, args, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

exports.close = async function close() {
  return new Promise((resolve, reject) => {
    con.end((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

 const tables = require("./tables");
