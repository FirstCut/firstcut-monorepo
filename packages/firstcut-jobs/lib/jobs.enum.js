"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JOBS = void 0;

var _pubsubJs = require("pubsub-js");

var JOBS = {
  scheduled_event: function scheduled_event(job) {
    _pubsubJs.PubSub.publish(job.event_data.event, job.event_data);
  },
  verify_google_credentials: function verify_google_credentials() {
    Meteor.call('checkOauthCredentials', function (err) {
      if (err) {
        _pubsubJs.PubSub.publish('error', {
          'error retrieving refresh token': err
        });
      } else {
        console.log('success');
      }
    });
  }
};
exports.JOBS = JOBS;