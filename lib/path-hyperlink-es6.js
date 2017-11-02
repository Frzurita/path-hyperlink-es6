'use babel';

import path from "path";
import fs from "fs";

module.exports = {
  activate() {
    require("atom-package-deps").install("path-hyperlink-es6");
  },
  getProvider() {
    return {
      wordRegExp: /\.{0,2}\/[A-Za-z0-9\-_\/.][A-Za-z0-9\-_\/. ]*/g,
      providerName: "path-hyperlink-es6",
      /**
       * textEditor {atom$TextEditor}
       * path {string}
       * range {atom$Range}
       */
      getSuggestionForWord(textEditor, _path, range){
        let dir = path.dirname(atom.workspace.getActiveTextEditor().getPath());
        _path = path.join(dir, _path);
        return {
          range,
          callback() {
            if (_path === undefined || _path.length === 0) { return; }
            fs.exists(_path, (exists) => {
              if (!exists) {
                atom.notifications.addError("File doesn't exist");
                return;
              }

              fs.lstat(_path, (_, stats) => {
                if (stats.isDirectory()) {
                  atom.notifications.addError("Cannot open directory");
                  return;
                }
                atom.workspace.open(_path);
              });
            });
          }
        };
      }
    };
  }
};
