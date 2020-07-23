var { Database } = require("../../database");
const { read } = require("fs");

var search = async function (name) {
  return new Promise((resolve, reject) => {
    var database, reader, data = [];
    database = new Database();
    database.open();
    reader = database.executeQueryReader(
      "SELECT_STUDENT_BY_NAME",
      { $name: name }
    );
    reader.on("data", (row) => {
      data[data.length] = row;
    });
    reader.on("complete", (count) => {
      resolve(data);
      database.close();
    });
    reader.on("error", (err) => {
      reject(err);
      database.close();
    });
    reader.read();
  });
};

module.exports = search;