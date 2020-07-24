var PurchaseLoader = require("./index");

(async function () {
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve();
  //   }, 1000);
  // });
  var loader = new PurchaseLoader();
  loader.on("readrow", (data) => {
    process.send("message", data);
  });
  loader.on("closed", () => {
    process.exit(0);
  });
  return await loader.load(process.argv[2]);
})().then(() => {
  process.exit(0);
}).catch((err) => {
  process.send(err);
  process.exit(1);
});



process.send(process.argv);
