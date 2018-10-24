"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchema = require("firstcut-schema");

var ConversationSchema = new _firstcutSchema.SimpleSchemaWrapper({
  participantIds: Array,
  'participantIds.$': String
});
ConversationSchema.extends(_firstcutSchema.BaseSchema);
var _default = ConversationSchema;
exports.default = _default;