var path = require("path");
var load = require("@garafu/mysql-fileloader").loadSync;
var SQL = load(path.join(__dirname, "./sql"));

module.exports = SQL;