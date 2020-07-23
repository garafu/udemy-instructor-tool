var { CsvReader } = require("at-framework/io");
var promisecallback = require("at-framework/async/promisecallback");
var path = require("path");
var fs = require("fs").promises;
var { EventEmitter } = require("events");
var util = require("util");

/**
 * CSVの行データ内容から利用するデータフォーマッタを取得する
 * @param {tupple} row 
 */
var getFormatter = function (row) {
  if (row.length === 15 &&
    (row[0]).match(/^\d+$/)) {
    return salesformat;
  }
  if (row.length === 5) {
    if (/^\d+$/.test(row[0])) {
      return redemptionsformat;
    } else if (/^\d{4}-\d{2}-\d{2}/.test(row[0])) {
      return refundsformat;
    }
  }
  return undefined;
};

var salesformat = function (row) {
  return {
    transaction_id: row[0],
    user_name: row[2],
    course_name: row[3],
    date: row[1],
    type: "sales",
    channel: row[5],
    coupon_code: row[4],
    paid_price: parseFloat(row[7] || 0),
    paid_currency: row[8],
    instructor_share: parseFloat(row[12] || 0)
  };
};

var redemptionsformat = function (row) {
  return {
    transaction_id: row[0],
    user_name: row[2],
    course_name: row[3],
    date: row[1],
    type: "redemptions",
    channel: null,
    coupon_code: row[4],
    paid_price: 0,
    paid_currency: null,
    instructor_share: 0
  };
};

var refundsformat = function (row) {
  return {
    transaction_id: null,
    user_name: row[1],
    course_name: row[2],
    date: row[0],
    type: "refunds",
    channel: null,
    coupon_code: null,
    paid_price: -(parseFloat(row[3] || 0)),
    paid_currency: null,
    instructor_share: -(parseFloat(row[4] || 0))
  };
};

/**
 * 指定したディレクトリ配下に存在する CSV ファイルパスを再帰的に探して取得する
 * @param {string} root 
 * @param {function(err, paths)} callback 
 * @returns {Promsie}
 */
var walk = function (root, callback) {
  return promisecallback(new Promise(async (resolve, reject) => {
    var data = [], list, fullpath, stat, tmppaths;
    try {
      list = await fs.readdir(root, { withFileTypes: true });
      for (let item of list) {
        fullpath = path.join(root, item.name);
        if (item.isDirectory()) {
          // Is Directory
          tmppaths = await walk(fullpath, callback);
          data = data.concat(tmppaths);
        } else {
          // Is File
          if ((path.extname(fullpath) || "").toLowerCase() === ".csv") {
            data[data.length] = fullpath;
          }
        }
      }
      resolve(data);
    } catch (err) {
      reject(err);
    }
  }), callback, this);
};

var PurchaseCsv = function (next) {
  this.add(next);
};
util.inherits(PurchaseCsv, EventEmitter);

PurchaseCsv.prototype.add = function (next) {
  this.next = next;
  this.on("readrow", (data) => {
    this.next.onReadRow(data);
  });
  this.on("closed", () => {
    this.next.onClosed();
  });
};

PurchaseCsv.prototype.execute = async function (directory) {
  var root, filepaths;

  // 指定したフォルダ以下にあるCSVファイルの絶対パスを検索
  root = directory ? directory : __dirname;
  filepaths = await walk(root);

  // 見つかったCSVファイルを読み込み
  for (let filepath of filepaths) {
    this.load(filepath);
  }
};

PurchaseCsv.prototype.load = function (filepath) {
  var csv = new CsvReader(filepath, "utf-8");

  // 一行ずつ読み取り
  csv.on("data", (row) => {
    var format, data;
    format = getFormatter(row);
    if (!format) {
      return;
    }
    data = format(row);
    this.emit("readrow", data);
  });
  csv.on("closed", () => {
    this.emit("closed");
  });
  csv.readRow(() => { });
};

module.exports = PurchaseCsv