"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SlackContentSchema = void 0;

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

/* View documentation at
https://api.slack.com/methods/chat.postMessage
for more info on this schema */
var SlackContentSchema = new _simplSchema.default({
  channel: String,
  text: {
    type: String,
    required: true
  },
  icon_emoji: String,
  as_user: Boolean,
  link_names: Boolean,
  mrkdwn: Boolean,
  parse: String,
  thread_ts: String,
  unfurl_links: Boolean,
  username: String,
  icon_url: {
    type: String,
    regEx: _simplSchema.default.RegEx.URL
  },
  attachments: Array,
  'attachments.$': Object,
  'attachments.$.fallback': String,
  'attachments.$.color': String,
  'attachments.$.author_link': String,
  'attachments.$.author_name': String,
  'attachments.$.author_icon': String,
  'attachments.$.title': String,
  'attachments.$.title_link': String,
  'attachments.$.text': String,
  'attachments.$.fields': Array,
  'attachments.$.image_url': {
    type: String,
    regEx: _simplSchema.default.RegEx.URL
  },
  'attachments.$.thumb_url': {
    type: String,
    regEx: _simplSchema.default.RegEx.URL
  },
  'attachments.$.footer': String,
  'attachments.$.footer_icon': String,
  'attachments.$.ts': _simplSchema.default.Integer,
  'attachments.$.fields.$': Object,
  'attachments.$.fields.$.title': String,
  'attachments.$.fields.$.value': String,
  'attachments.$.fields.$.short': Boolean
}, {
  requiredByDefault: false
});
exports.SlackContentSchema = SlackContentSchema;