var fs = require("fs");
var path = require("path");
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