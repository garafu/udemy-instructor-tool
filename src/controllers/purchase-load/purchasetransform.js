var { EventEmitter } = require("events");
var util = require("util");
var moment = require("moment-timezone");

var PurchaseTransform = function (next) {
  this.add(next);
};
util.inherits(PurchaseTransform, EventEmitter);

PurchaseTransform.prototype.add = function (next) {
  this.on("readrow", (data) => {
    next.onReadRow(data);
  });
  this.on("closed", () => {
    next.onClosed();
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