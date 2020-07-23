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
  ipcMain.handle("cfgPurchaseCsvLoad", async (event, directory) => {
    // 売上データ読み込み
    return await require("./controllers/purchase-load")(directory);
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
