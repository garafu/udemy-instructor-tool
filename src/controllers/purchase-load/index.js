var load = async function (directory, callback) {
  var db = new (require("./purchasedb"))();
  var transform = new (require("./purchasetransform"))(db);
  var csv = new (require("./purchasecsv"))(transform);
  await csv.execute(directory);
};

module.exports = load;