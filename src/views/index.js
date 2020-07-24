// const sqlite3 = require("sqlite3").verbose();
// var db = new sqlite3.Database("sample.db", (err)=>{

// });
// db.serialize(() => {
//   // db.run("insert into users ('name', 'email', 'age') values (?, ?, ?)", ["tanaka", "hoge@hoge.com", 10]);
//   db.run("insert into students (name) values ('tanaka')");
//   db.close();
// });
const { remote, ipcRenderer } = require("electron");

// [設定]
var btnConfig_onclick = function (event) {
  $("#cover").toggle();
  $("#dialogs").toggle();
  $("#settings").toggle();
  return false;
};

// [設定]-[売上データ]-[フォルダを開く]
var btnConfigPurchaseFolderOpen_onclick = async function (event) {
  var result = await ipcRenderer.invoke("cfgPurchaseFolderOpen");
  var directory = !result.canceled ? result.filePaths[0] : "";
  $("#txtSourceDirectory").val(directory);
};

// [設定]-[売上データ]-[読み込み]
var btnConfigPurchaseLoad_onclick = async function (event) {
  // $("#btnConfigPurchaseLoad").addClass("disabled");
  // await ipcRenderer.invoke("cfgPurchaseCsvLoad", $("#txtSourceDirectory").val());
  // $("#btnConfigPurchaseLoad").removeClass("disabled");
  // window.alert("Completed !");
  $("#msgError").empty().css({ display: "none" });
  $("#msgSuccess").empty().css({ display: "none" });

  var directory = $("#txtSourceDirectory").val();
  if (!directory) {
    // window.alert("ディレクトリを指定してください");
    window.setTimeout(() => {
      $("#msgError")
        .css({ display: "block" })
        .append(document.createTextNode("ディレクトリを指定してください"));
    });
    return;
  }

  // $("#btnConfigPurchaseLoad").addClass("disabled");
  $("#btnConfigPurchaseLoad").prop("disabled", true);
  $("#progressArea").css({ display: "block" });
  $("#progressMessage").empty();
  // ipcRenderer.send("cfgPurchaseCsvLoad", directory);
  ipcRenderer.invoke("cfgPurchaseCsvLoad", directory);
};

ipcRenderer.on("cfgPurchaseCsvLoadProgress", (event, data) => {
  var message = `[${data.date}] ${data.type}: ${data.user_name}`;
  $("#progressMessage").empty().append(document.createTextNode(message));
});

ipcRenderer.on("cfgPurchaseCsvLoadCompleted", (event, message) => {
  $("#progressArea").css({ display: "none" });
  // $("#btnConfigPurchaseLoad").removeClass("disabled").focus();
  $("#btnConfigPurchaseLoad").prop("disabled", false);
  $("#msgSuccess")
    .css({ display: "block" })
    .append(document.createTextNode("読み込み完了！"));
  // window.alert("読み込み完了！");
});

// [受講生]-[検索]
var btnStudentsSearch_onclick = async function (event) {
  var list = await ipcRenderer.invoke("stdSearch", $("#txtStudentsSearch").val());
  var createElement = function (name) {
    var root = document.createElement("li");
    var input = document.createElement("input");
    input.dataset.name = name;
    input.type = "button";
    input.className = "btn btn-link nav-link w-100 text-left";
    input.value = name;
    root.className = "nav-item";
    root.appendChild(input);
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

// [受講生]-[名前]
var lstStudents_onclick = async function (event) {
  var name = $(event.target).data("name");
  if (!name) {
    return
  }
  var list = await ipcRenderer.invoke("stdDetail", name);
  var createCell = function (value) {
    var td = document.createElement("td");
    var text = document.createTextNode(value);
    td.appendChild(text);
    return td;
  };
  var createRow = function (item) {
    var tr = document.createElement("tr");
    tr.appendChild(createCell(item.date));
    tr.appendChild(createCell(item.course_name));
    tr.appendChild(createCell(item.type));
    tr.appendChild(createCell(item.paid_price));
    tr.appendChild(createCell(item.paid_currency));
    if (item.type === "refunds") {
      tr.className = "table-danger";
    }
    return tr;
  };

  // 生徒名の反映
  $("#ttlStudentName").empty().append(document.createTextNode(name));

  // 売上情報の反映
  var $details = $("#tblStudentDetailInfo");
  $details.empty();
  for (var item of list) {
    $details.append(createRow(item));
  }
};

$(window).on("load", (event) => {
  $("#btnConfigOpen").on("click", btnConfig_onclick);
  $("#btnConfigClose").on("click", btnConfig_onclick);
  $("#btnConfigPurchaseFolderOpen").on("click", btnConfigPurchaseFolderOpen_onclick);
  $("#btnConfigPurchaseLoad").on("click", btnConfigPurchaseLoad_onclick);
  $("#btnStudentsSearch").on("click", btnStudentsSearch_onclick);
  $("#lstStudents").on("click", lstStudents_onclick);
});