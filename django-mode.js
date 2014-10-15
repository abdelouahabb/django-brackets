// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
	"use strict";
	var CodeMirror = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror");
	brackets.getModule("thirdparty/CodeMirror2/mode/htmlmixed/htmlmixed");
	brackets.getModule("thirdparty/CodeMirror2/addon/mode/overlay");
		
	CodeMirror.defineMode("django:inner", function() {
    var keywords = ["block", "endblock", "for", "endfor", "in", "true", "false",
                    "loop", "none", "self", "super", "if", "endif", "as", "not", "and",
                    "else", "import", "with", "endwith", "without", "context", "ifequal", "endifequal",
                    "ifnotequal", "endifnotequal", "extends", "include", "load", "length", "comment",
                    "endcomment", "empty"];
    keywords = new RegExp("^((" + keywords.join(")|(") + "))\\b");

    function tokenBase (stream, state) {
      stream.eatWhile(/[^\{]/);
      var ch = stream.next();
      if (ch == "{") {
		  ch = stream.eat(/#/);
		  if (ch) { //we have a line comment
			  stream.eatWhile(/[^\#]/);
			  ch = stream.next();
			  if (ch === "#" && stream.peek() === "}") {
				  stream.next();
				  state.tokenize = tokenBase;
				  return "comment";
			  }
		  }
		  ch = stream.eat(/\{|%|#/);
		  if (ch) {
			  state.tokenize = inTag(ch);
			  return "tag";
		  }
      }
    }
    function inTag (close) {
      if (close == "{") {
        close = "}";
      }
      return function (stream, state) {
        var ch = stream.next();
        if ((ch == close) && stream.eat("}")) {
          state.tokenize = tokenBase;
          return "tag";
        }
        if (stream.match(keywords)) {
          return "keyword";
        }
        return close == "#" ? "comment" : "string";
      };
    }
    return {
      startState: function () {
        return {tokenize: tokenBase};
      },
      token: function (stream, state) {
        return state.tokenize(stream, state);
      }
    };
  });

  CodeMirror.defineMode("django", function(config) {
    var htmlBase = CodeMirror.getMode(config, "text/html");
    var djangoInner = CodeMirror.getMode(config, "django:inner");
    return CodeMirror.overlayMode(htmlBase, djangoInner);
  });

  CodeMirror.defineMIME("text/x-django", "django");
});