const sqlite3 = require("sqlite3").verbose();
const SQL = require("./sql");
const { DATABASE_FILE_NAME } = require("./config");

var initialize = function () {
  var db = new sqlite3.Database(DATABASE_FILE_NAME);
  db.serialize(() => {
    db.exec(SQL["CREATE_TABLE"]);
    db.close();
  });
};

module.exports = initialize;