var { Database } = require("../../database");

var PurchaseDb = function () {
  this.db = new Database();
  this.tasks = [];
  this.db.open();
};

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
};

PurchaseDb.prototype.onClosed = function () {
  Promise.all(this.tasks).then(() => {
    this.db.close();
  });
};

module.exports = PurchaseDb;