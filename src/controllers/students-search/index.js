var path = require("path");
var config = require("../config").load();
var SQL = require("@garafu/mysql-fileloader").loadSync(path.join(__dirname, "./sql"));
var sqlite3 = require("sqlite3").verbose();
const DATABASE_FILE_PATH = path.join(process.env.APP_ROOT_DIR || __dirname, config.DATABASE.FILE_PATH);
var db = new sqlite3.Database(DATABASE_FILE_PATH);

var search = async function (name) {
  return new Promise((resolve, reject) => {
    if (name) {
      db.all(SQL["SEARCH_STUDENT_BY_NAME"], { $name: `%${name}%` }, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });

    } else {
      db.all(SQL["SEARCH_ALL_STUDENTS"], (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    }
  });
};

module.exports = search;