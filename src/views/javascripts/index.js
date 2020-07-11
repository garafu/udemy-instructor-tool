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
  $("#btnConfigPurchaseLoad").addClass("disabled");
  await ipcRenderer.invoke("cfgPurchaseCsvLoad", $("#txtSourceDirectory").val());
  $("#btnConfigPurchaseLoad").removeClass("disabled");
  window.alert("Completed !");
};

var btnStudentsSearch_onclick = async function (event) {
  var list = await ipcRenderer.invoke("stdSearch", $("#txtStudentsSearch").val());
  var createElement = function (name) {
    var root = document.createElement("li");
    var anchor = document.createElement("a");
    var text = document.createTextNode(name);
    anchor.href = name;
    anchor.className = "nav-link";
    anchor.appendChild(text);
    root.className = "nav-item";
    root.appendChild(anchor);
    return root;
  }
  var $students = $("#lstStudents")

  // クリア
  $students.empty();

  // 追加
  for (var item of list) {
    $students.append(createElement(item.user_name));
  }
};

$(window).on("load", (event) => {
  $("#btnConfigOpen").on("click", btnConfig_onclick);
  $("#btnConfigClose").on("click", btnConfig_onclick);
  $("#btnConfigPurchaseFolderOpen").on("click", btnConfigPurchaseFolderOpen_onclick);
  $("#btnConfigPurchaseLoad").on("click", btnConfigPurchaseLoad_onclick);
  $("#btnStudentsSearch").on("click", btnStudentsSearch_onclick);
});