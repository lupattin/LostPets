"use strict";
exports.__esModule = true;
exports.index = void 0;
var algoliasearch_1 = require("algoliasearch");
var client = (0, algoliasearch_1["default"])('82V25X16NI', 'b5521161f16e4ae727d51d560146e17c');
exports.index = client.initIndex('pets');
