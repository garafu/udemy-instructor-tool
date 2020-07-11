var fs = require("fs");
var config = require("../config").load();
var path = require("path");
var sqlite3 = require("sqlite3").verbose();
var { File, Directory } = require("at-framework/io");
var promisecallback = require("at-framework/async/promisecallback");
var SQL = require("@garafu/mysql-fileloader").loadSync(path.join(__dirname, "./sql"));
var DATABASE_FILE_PATH = path.join(process.env.APP_ROOT_DIR || __dirname, config.DATABASE.FILE_PATH);
/**
 * データベースを作成
 * @param {sqlite3.Database} db 
 * @param {function(err)} callback 
 */
var createDatabase = function (db, callback) {
  return promisecallback(new Promise((resolve, reject) => {
    db.exec(SQL["CREATE_TABLE"], (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  }), callback, this);
};

var initialize = async function () {
  var exists, db;

  // DBファイルの存在確認
  exists = await File.exists(DATABASE_FILE_PATH);

  // フォルダ作成
  await Directory.create(path.dirname(DATABASE_FILE_PATH));

  // DBファイル作成 or 読み込み
  db = new sqlite3.Database(DATABASE_FILE_PATH);

  // DBファイル初回作成の場合、初期化
  if (!exists) {
    console.log("Database file is NOT exists. Creating database.");
    await createDatabase(db);
  }

  // DB接続の切断
  db.close();
};

// var main = async function () {
//   await initialize();
// };
// main();

module.exports = initialize;