var { EventEmitter } = require("events");
var util = require("util");
var moment = require("moment-timezone");

var PurchaseTransform = function (database) {
  this.add(database);
};
util.inherits(PurchaseTransform, EventEmitter);

PurchaseTransform.prototype.add = function (database) {
  this.on("readrow", (data) => {
    database.onReadRow(data);
  });
  this.on("closed", () => {
    database.onClosed();
  });
};

PurchaseTransform.prototype.onReadRow = function (data) {
  data.date = moment.utc(data.date,["MMM DD 'YY", "YYYY-MM-DD HH:mm:ss ZZ"]).tz("Japan").format();

  this.emit("readrow", data);
};

PurchaseTransform.prototype.onClosed = function () {
  this.emit("closed");
};

module.exports = PurchaseTransform;