define(function (require, exports, module) {
  'use strict';

  var LanguageManager = brackets.getModule("language/LanguageManager");

  LanguageManager.defineLanguage("Django", {
      name: "Django",
      mode: "Django",
      fileExtensions: ["html", "htm"],
  });
});
