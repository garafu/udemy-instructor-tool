process.env.APP_ROOT_DIR = __dirname;
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const db = require("./database");

var initialize = function () {
  var win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // DB初期化
  db.initialize();

  // [設定]-[売り上げデータ]-[フォルダを開く]
  ipcMain.handle("cfgPurchaseFolderOpen", () => {
    return dialog.showOpenDialog(win, { properties: ["openDirectory"] });
  });

  // [設定]-[売り上げデータ]-[読み取り]
  // ipcMain.handle("cfgPurchaseCsvLoad", async (event, directory) => {
  //   // 売上データ読み込み
  //   var loader = new (require("./controllers/purchase-load"))();
  //   loader.on("readrow", (data)=>{ win.webContents.send("cfgPurchaseCsvLoadProgress", data); });
  //   // loader.on("closed", ()=>{});
  //   return await loader.load(directory);
  //   // return await require("./controllers/purchase-load")(directory);
  // });
  ipcMain.handle("cfgPurchaseCsvLoad", (event, directory) => {
    // global.setTimeout(() => {
    // (async () => {
      var PurchaseLoader = require("./controllers/purchase-load");
      var loader = new PurchaseLoader();
      loader.on("readrow", (data) => {
        win.webContents.send("cfgPurchaseCsvLoadProgress", data);
        // event.reply("cfgPurchaseCsvLoadProgress", data);
      });
      loader.on("completed", (count) => {
        win.webContents.send("cfgPurchaseCsvLoadCompleted");
        // event.reply("cfgPurchaseCsvLoadCompleted", count);
      });
      loader.load(directory);
    // })();
    // }, 0);
    // const { fork } = require("child_process");
    // const path = require("path");
    // var child = fork(path.join(__dirname, "./controllers/purchase-load/child.js"), [directory], { execArgv: [] });
    // child.on("message", (message) => {
    //   win.webContents.send("cfgPurchaseCsvLoadProgress", message);
    // });
    // child.on("error", (error) => {
    //   console.log(error);
    // });
    // child.on("exit", (code, signal) => {
    //   console.log(code);
    // });
    // child.on("close", (code) => {
    //   win.webContents.send("cfgPurchaseCsvLoadCompleted");
    // });
  });

  // [受講生]-[検索]
  ipcMain.handle("stdSearch", async (event, name) => {
    // 受講生一覧検索
    return await require("./controllers/students-search")(name);
  });

  // [受講生]-[名前]
  ipcMain.handle("stdDetail", async (event, name) => {
    // 受講生詳細検索
    return await require("./controllers/students-detail")(name);
  });

  win.loadFile("./views/index.html");
};

app.whenReady().then(initialize);
