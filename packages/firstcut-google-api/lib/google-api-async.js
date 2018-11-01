"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GoogleApi = void 0;

var _lodash = require("lodash");

var _utils = require("./utils.js");

// kill logs
var Log = function Log() {};

var GoogleApi = {
  // host component, shouldn't change
  _host: 'https://www.googleapis.com',
  _callAndRefresh: function _callAndRefresh(method, path, options, callback) {
    var self = this;
    options = options || {};

    self._call(method, path, options, // need to bind the env here so we can do mongo writes in the callback
    // (when refreshing), if we call this on the server
    Meteor.bindEnvironment(function (error, result) {
      if (error && error.response && error.response.statusCode == 401) {
        Log('google-api attempting token refresh');
        return self._refresh(options.user, function (error) {
          if (error) return callback(error); // if we have the user, we'll need to re-fetch them, as their
          // access token will have changed.

          if (options.user) options.user = Meteor.users.findOne(options.user._id);

          self._call(method, path, options, callback);
        });
      }

      callback(error, result);
    }, 'Google Api callAndRefresh'));
  },
  // call a GAPI Meteor.http function if the accessToken is good
  _call: function _call(method, path, options, callback) {
    Log("GoogleApi._call, path:".concat(path)); // copy existing options to modify

    options = _lodash._.extend({}, options);
    var user = options.user || Meteor.user();
    delete options.user;

    if (user && user.services && user.services.google && user.services.google.accessToken) {
      console.log('ACCESS TOKEN');
      options.headers = options.headers || {};
      options.headers.Authorization = "Bearer ".concat(user.services.google.accessToken);
      HTTP.call(method, "".concat(this._host, "/").concat(path), options, function (error, result) {
        console.log('called the method');
        console.log('HERE IS THE ERRROr');
        console.log(error);
        callback(error, result && result.data);
      });
    } else {
      callback(new Meteor.Error(403, 'Auth token not found.' + 'Connect your google account'));
    }
  },
  _refresh: function _refresh(user, callback) {
    Log('GoogleApi._refresh');
    console.log('About to refresh');
    Meteor.call('exchangeRefreshToken', user && user._id, function (error, result) {
      console.log('Exchaning refresh token');
      console.log(error);
      callback(error, result && result.access_token);
    });
  }
}; // setup HTTP verbs

exports.GoogleApi = GoogleApi;
var httpVerbs = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

_lodash._.each(httpVerbs, function (verb) {
  GoogleApi[verb.toLowerCase()] = (0, _utils.wrapAsync)(function (path, options, callback) {
    if (_lodash._.isFunction(options)) {
      callback = options;
      options = {};
    }

    return this._callAndRefresh(verb, path, options, callback);
  });
});