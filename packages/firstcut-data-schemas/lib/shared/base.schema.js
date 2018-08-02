"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _freeze = _interopRequireDefault(require("@babel/runtime/core-js/object/freeze"));

var BaseSchema = (0, _freeze.default)({
  _id: {
    type: String
  },
  createdBy: {
    type: String,
    label: 'Document Created By',
    autoValue: function autoValue() {
      if (!this.isSet) {
        return Meteor.userId();
      } //TODO: this should probably be the player profile not the user?

    }
  },
  createdAt: {
    type: Date,
    label: 'Created At',
    autoValue: function autoValue() {
      if (!this.isSet) {
        return new Date();
      }
    }
  },
  updatedAt: {
    type: Date,
    label: 'Created At',
    autoValue: function autoValue() {
      if (this.isUpsert || this.isUpdate) {
        return new Date();
      }
    }
  },
  history: {
    type: Array
  },
  'history.$': {
    type: Object
  },
  'history.$.event': String,
  'history.$.timestamp': {
    type: Date,
    autoValue: function autoValue() {
      if (!this.isSet) {
        return new Date();
      }
    }
  },
  'history.$.gig_id': String,
  'history.$.event_id': String,
  'history.$.scheduled_job_id': String,
  'history.$.gig_type': String,
  'history.$.initiator_player_id': {
    type: String
  },
  'history.$.collaborator_key': String
});
var _default = BaseSchema;
exports.default = _default;