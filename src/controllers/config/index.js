var path = require("path");
var { File, StreamWriter } = require("at-framework/io");
const CONFIG_FILE_NAME = "config.json";
const CONFIG_FILE_PATH = path.join(process.env.APP_ROOT_DIR || __dirname, CONFIG_FILE_NAME);
var config = undefined;

var initialize = async function () {
  // config の有無確認
  if (await File.exists(CONFIG_FILE_PATH)) {
    return;
  }

  // なければ新規作成
  config = {
    DATABASE: {
      FILE_PATH: "./database/my.db"
    },
    SOURCE: {
      PURCHASE_DIR: "./source/purchases"
    }
  };
  await save();
};

var load = function () {
  if (!config) {
    config = require(CONFIG_FILE_PATH);
  }
  return config;
};

var save = function () {
  var writer = new StreamWriter(CONFIG_FILE_PATH, "utf-8");
  writer.write(JSON.stringify(config, null, 2));
  writer.close();
}

module.exports = {
  initialize,
  load,
  save
};