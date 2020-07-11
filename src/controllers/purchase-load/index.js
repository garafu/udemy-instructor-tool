var fs = require("fs");
var config = require("./config");
var path = require("path");
var sqlite3 = require("sqlite3").verbose();
var SQL = require("./sql.js");
var { File } = require("at-framework/io");

/**
 * データベースを作成
 * @param {sqlite3.Database} db 
 * @param {function(err)} callback 
 */
var createDatabase = function (db, callback) {
  var p = new Promise((resolve, reject) => {
    db.exec(SQL["CREATE_TABLE"], (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
  return require("./promisecallback")(p, callback, this);
};

var initialize = async function () {
  // DBファイルの存在確認
  var exists = await File.exists(path.join(__dirname, config.DATABASE.FILE_PATH));
  console.log(exists);

  // DBファイル作成 or 読み込み
  var db = new sqlite3.Database(path.join(__dirname, config.DATABASE.FILE_PATH));

  // DBファイル初回作成の場合、初期化
  if (!exists) {
    await createDatabase(db);
  }

  // DB接続の切断
  db.close();
};

/**
 * メイン
 */
var load = async function (directory, callback) {
  return (require("at-framework/async/promisecallback"))(
    new Promise(async (resolve, reject) => {
      // // 初期化処理
      // await initialize();

      // CSVファイルの読み込み、保存
      var db = new (require("./purchasedb"))();
      var transform = new (require("./purchasetransform"))(db);
      var csv = new (require("./purchasecsv"))(transform);
      await csv.execute(directory);
      resolve("OK");
    }), callback)
};
// main();

module.exports = load;
