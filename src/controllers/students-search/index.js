var { Database } = require("../../database");


var search = async function (name) {
  return new Promise((resolve, reject) => {
    var database, reader, data = [];
    database = new Database();
    database.open();
    if (name) {
      reader = database.executeQueryReader(
        "SEARCH_STUDENT_BY_NAME",
        { $name: `%${name}%` }
      );
    } else {
      reader = database.executeQueryReader(
        "SEARCH_ALL_STUDENTS"
      );
    }
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