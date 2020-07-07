const { app, BrowserWindow, ipcMain, dialog } = require("electron");

var initialize = function () {
  var win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true
    }
  });

  ipcMain.handle("cfgPurchaseFolderOpen", () => {
    return dialog.showOpenDialog(win, { properties: ["openDirectory"] });
  });

  ipcMain.handle("cfgPurchaseCsvLoad", (event, directory) => {
    console.log(directory);
  });

  win.loadFile("index.html");
};

app.whenReady().then(initialize);