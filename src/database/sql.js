var fs = require("fs");
var path = require("path");
const database = require(".");
var APP_ROOT_DIR = process.env.APP_ROOT_DIR || __dirname;
var target = "";

// fs.appendFileSync("D:\\sample.log", `APP_ROOT_DIR: ${APP_ROOT_DIR}\r\n`, "utf-8");

// if (path.extname(APP_ROOT_DIR) === ".asar") {
//   // プロダクション環境
//   target = path.join(
//     path.dirname(APP_ROOT_DIR),
//     "./sql"
//   );
// } else {
//   // 開発環境
//   target = path.join(
//     APP_ROOT_DIR,
//     "./database/sql"
//   );
// }

// fs.appendFileSync("D:\\sample.log", `target      : ${target}\r\n`, "utf-8");

// var SQL = require("@garafu/mysql-fileloader").loadSync(target);

// module.exports = SQL;
var cwd = __dirname;
var list = [
  "./sql/CREATE_TABLE.sql",
  "./sql/INSERT_TRANSACTION.sql",
  "./sql/SEARCH_ALL_STUDENTS.sql",
  "./sql/SEARCH_STUDENT_BY_NAME.sql",
  "./sql/SELECT_STUDENT_BY_NAME.sql",
];

var format = function (text) {
  return (text || "").replace(/\s+/g, " ");
};

var load = function (list, cwd) {
  var data = {};
  for (let item of list) {
    let name = path.basename(item, path.extname(item));
    let text = fs.readFileSync(path.join(cwd, item), "utf-8");
    data[name] = format(text);
  }
  return data;
};

module.exports = load(list, cwd);