var path = require("path");
var { FILE_PATH } = require("./config").DATABASE;
var SQL = require("./sql.js");
var sqlite3 = require("sqlite3").verbose();

var PurchaseDb = function () {
  this.db = new sqlite3.Database(path.join(process.env.APP_ROOT_DIR || __dirname, FILE_PATH));
};

PurchaseDb.prototype.save = function (data) {
  console.log(data);
};

PurchaseDb.prototype.onReadRow = function (data) {
  this.db.run(SQL["INSERT_TRANSACTION"], {
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
  this.db.close();
};

module.exports = PurchaseDb;