"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

// import SimpleSchema from 'simpl-schema';
var BaseSchema = Object.freeze({
  _id: {
    type: String
  },
  // createdBy: {
  //   type: String,
  //   label: 'Document Created By',
  //   restricted: true,
  //   autoValue() {
  //     if (!this.isSet) {
  //       try {
  //         return Meteor.userId();
  //       } catch (e) {
  //         console.log('CATCCH');
  //         console.log(e);
  //         return '';
  //       }
  //     } // TODO: this should probably be the player profile not the user?
  //   },
  // },
  createdAt: {
    type: Date,
    label: 'Created At',
    restricted: true,
    autoValue: function autoValue() {
      if (!this.isSet) {
        return new Date();
      }
    }
  },
  updatedAt: {
    type: Date,
    label: 'Created At',
    restricted: true,
    autoValue: function autoValue() {
      if (this.isUpsert || this.isUpdate) {
        return new Date();
      }
    }
  },
  history: {
    restricted: true,
    type: Array
  },
  'history.$': {
    type: Object
  },
  'history.$.event': {
    type: String,
    allowedValues: _firstcutPipelineConsts.SUPPORTED_EVENTS
  },
  'history.$.timestamp': {
    type: Date,
    autoValue: function autoValue() {
      if (!this.isSet) {
        return new Date();
      }
    }
  },
  'history.$.gig_id': {
    type: String,
    allowedValues: _firstcutPipelineConsts.SUPPORTED_RECIPIENTS
  },
  'history.$.event_id': String,
  'history.$.scheduled_job_id': String,
  'history.$.gig_type': {
    type: String,
    allowedValues: _firstcutPipelineConsts.SUPPORTED_RECIPIENTS
  },
  'history.$.initiator_player_id': {
    type: String
  },
  'history.$.collaborator_key': String
});
var _default = BaseSchema;
exports.default = _default;