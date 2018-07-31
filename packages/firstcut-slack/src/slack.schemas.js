

import SimpleSchema from 'simpl-schema';

/* View documentation at
https://api.slack.com/methods/chat.postMessage
for more info on this schema */
export const SlackContentSchema = new SimpleSchema({
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
    regEx: SimpleSchema.RegEx.URL
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
    regEx: SimpleSchema.RegEx.URL
  },
  'attachments.$.thumb_url': {
    type: String,
    regEx: SimpleSchema.RegEx.URL
  },
  'attachments.$.footer': String,
  'attachments.$.footer_icon': String,
  'attachments.$.ts': SimpleSchema.Integer,
  'attachments.$.fields.$': Object,
  'attachments.$.fields.$.title': String,
  'attachments.$.fields.$.value': String,
  'attachments.$.fields.$.short': Boolean,
}, {requiredByDefault: false});
