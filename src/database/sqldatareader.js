const util = require("util");
const { EventEmitter } = require("events");
const SQL = require("./sql");

var SqlDataReader = function (db, name, params) {
  this.db = db;         // sqlite3.Database
  this.name = name;
  this.params = params;
};
util.inherits(SqlDataReader, EventEmitter);

SqlDataReader.prototype.read = function () {
  this.db.each(SQL[this.name], this.params, (err, row) => {
    if (err) {
      return this.emit("error", err);
    }
    this.emit("data", row);
  }, (err, count) => {
    if (err) {
      return this.emit("error", err);
    }
    this.emit("complete", count);
  });
};

module.exports = SqlDataReader;