"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("../semantic/dist/semantic.min.css");

var _semanticUiReact = require("semantic-ui-react");

Object.keys(_semanticUiReact).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _semanticUiReact[key];
    }
  });
});