const util = require("util");
const { EventEmitter } = require("events");
const sqlite3 = require("sqlite3").verbose();
const SqlDataReader = require("./sqldatareader");
const SQL = require("./sql");
const { DATABASE_FILE_NAME } = require("./config");

var Database = function () {
  this.db = null;
  this.tasks = [];
};
util.inherits(Database, EventEmitter);

Database.prototype.open = function () {
  if (this.db) {
    return;
  }
  this.db = new sqlite3.Database(DATABASE_FILE_NAME);
};

Database.prototype.close = function () {
  if (!this.db) {
    return;
  }
  this.db.close();
  this.db = null;
};

Database.prototype.executeNonQuery = async function (name, params) {
  return new Promise((resolve, reject) => {
    this.db.run(SQL[name], params, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

Database.prototype.executeQueryReader = function (name, params) {
  return new SqlDataReader(this.db, name, params);
};

module.exports = Database;