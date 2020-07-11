const { remote, ipcRenderer } = require("electron");

var btnConfig_onclick = function (event) {
  $("#cover").toggle();
  $("#dialogs").toggle();
  $("#settings").toggle();
  return false;
};

var btnConfigPurchaseFolderOpen_onclick = async function (event) {
  var result = await ipcRenderer.invoke("cfgPurchaseFolderOpen");
  var directory = !result.canceled ? result.filePaths[0] : "";
  $("#txtSourceDirectory").val(directory);
};

var btnConfigPurchaseLoad_onclick = async function (event) {
  ipcRenderer.invoke("cfgPurchaseCsvLoad", $("#txtSourceDirectory").val());
};

$(window).on("load", (event) => {
  $("#btnConfigOpen").on("click", btnConfig_onclick);
  $("#btnConfigClose").on("click", btnConfig_onclick);
  $("#btnConfigPurchaseFolderOpen").on("click", btnConfigPurchaseFolderOpen_onclick);
  $("#btnConfigPurchaseLoad").on("click", btnConfigPurchaseLoad_onclick);
});