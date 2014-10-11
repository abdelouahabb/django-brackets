define(function (require, exports, module) {
  'use strict';

  var LanguageManager = brackets.getModule("language/LanguageManager");

  LanguageManager.defineLanguage("django", {
      name: "Django",
      mode: "django",
      fileExtensions: ["html", "htm"],
  });
});
