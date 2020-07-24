const util = require("util");
const { EventEmitter } = require("events");

var PurchaseLoader = function () {

};
util.inherits(PurchaseLoader, EventEmitter);

/**
 * 指定されたディレクトリ配下に存在する売り上げCSVファイルをSqlite3に読み込み
 * @param {string}} directory 
 * @param {function()} callback 
 */
PurchaseLoader.prototype.load = async function (directory, callback) {
  var db = new (require("./purchasedb"))();
  var transform = new (require("./purchasetransform"))(db);
  var csv = new (require("./purchasecsv"))(transform);
  csv.on("readrow", (data) => {
    this.emit("readrow", data);
  });
  csv.on("closed", () => {
    this.emit("closed");
  });
  csv.on("completed", (count) => {
    this.emit("completed", count);
  });
  await csv.execute(directory);
};

module.exports = PurchaseLoader;