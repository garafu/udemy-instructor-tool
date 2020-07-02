const { app, BrowserWindow } = require("electron");

var initialize = function () {
  var win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile("index.html");
};

app.whenReady().then(initialize);