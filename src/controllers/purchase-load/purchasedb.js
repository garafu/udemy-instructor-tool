const util = require("util");
const {EventEmitter} = require("events");
const { Database } = require("../../database");
const PurchaseLoader = require(".");

var PurchaseDb = function () {
  this.db = new Database();
  this.tasks = [];
  this.db.open();
};
util.inherits(PurchaseDb, EventEmitter);

PurchaseDb.prototype.onReadRow = function (data) {
  this.tasks[this.tasks.length] = this.db.executeNonQuery(
    "INSERT_TRANSACTION", {
    $transaction_id: data.transaction_id,
    $user_name: data.user_name,
    $course_name: data.course_name,
    $date: data.date,
    $type: data.type,
    $channel: data.channel,
    $vendor: data.vendor,
    $coupon_code: data.coupon_code,
    $paid_price: data.paid_price,
    $paid_currency: data.paid_currency,
    $instructor_share: data.instructor_share
  });
  this.emit("readrow", data);
};

PurchaseDb.prototype.onClosed = function () {
  Promise.all(this.tasks).then(() => {
    this.db.close();
    this.emit("closed");
  });
};

PurchaseDb.prototype.onCompleted = function (count){
  this.emit("completed", count);
};

module.exports = PurchaseDb;