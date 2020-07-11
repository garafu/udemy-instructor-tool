const path = require("path");
const { File, StreamWriter } = require("at-framework/io");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
process.env.NODE_PATH = __dirname;

/**
 * 初期化処理
 */
var initialize = async function () {
  // chromiumの初期化
  var win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // 設定ファイルの初期化/読み込み
  await (require("./controllers/config").initialize)();

  // DBファイル初期化
  await (require("./controllers/database"))();

  // [設定]-[売り上げデータ]-[フォルダを開く]
  ipcMain.handle("cfgPurchaseFolderOpen", () => {
    return dialog.showOpenDialog(win, { properties: ["openDirectory"] });
  });

  // [設定]-[売り上げデータ]-[読み取り]
  ipcMain.handle("cfgPurchaseCsvLoad", async (event, directory) => {
    // 売上データ読み込み
    await require("./controllers/purchase-load")(directory)
  });

  // メインウィンドウ起動
  win.loadFile("./views/index.html");
};

app.whenReady().then(initialize);