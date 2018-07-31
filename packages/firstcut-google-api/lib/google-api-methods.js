"use strict";

var _meteor = require("meteor/meteor");

var _http = require("meteor/http");

_meteor.Meteor.methods({
  // Obtain a new access token using the refresh token
  checkOauthCredentials: function checkOauthCredentials() {
    var config = Accounts.loginServiceConfiguration.findOne({
      service: "google"
    });
    var params = {
      'client_id': config.clientId,
      'scope': 'https://www.googleapis.com/auth/calendar',
      'response_type': 'code',
      'redirect_uri': "http://localhost:3000/_oauth/google"
    };
    var auth_url = "https://accounts.google.com/o/oauth2/v2/auth";

    try {
      var result = _http.HTTP.call("POST", auth_url, {
        params: params
      });
    } catch (e) {
      if (e) {
        var code = e.response ? e.response.statusCode : 500;
        throw new _meteor.Meteor.Error(code, 'Unable to verify google oauth credentials.', e.response);
      }
    }
  },
  exchangeRefreshToken: function exchangeRefreshToken(userId) {
    this.unblock();

    if (this.connection) {
      //when called from client
      if (this.userId) {
        userId = this.userId;
      } else {
        throw new _meteor.Meteor.Error(403, "Must be signed in to use Google API.");
      }
    }

    var user;

    if (userId && _meteor.Meteor.isServer) {
      user = _meteor.Meteor.users.findOne({
        _id: userId
      });
    } else {
      user = _meteor.Meteor.user();
    }

    var config = Accounts.loginServiceConfiguration.findOne({
      service: "google"
    });
    if (!config) throw new _meteor.Meteor.Error(500, "Google service not configured.");
    if (!user.services || !user.services.google || !user.services.google.refreshToken) throw new _meteor.Meteor.Error(500, "Refresh token not found.");

    try {
      var result = _http.HTTP.call("POST", "https://accounts.google.com/o/oauth2/token", {
        params: {
          'client_id': config.clientId,
          'client_secret': config.secret,
          'refresh_token': user.services.google.refreshToken,
          'grant_type': 'refresh_token'
        }
      });
    } catch (e) {
      var code = e.response ? e.response.statusCode : 500;
      throw new _meteor.Meteor.Error(code, 'Unable to exchange google refresh token.', e.response);
    }

    if (result.statusCode === 200) {
      _meteor.Meteor.users.update(user._id, {
        '$set': {
          'services.google.accessToken': result.data.access_token,
          'services.google.expiresAt': +new Date() + 1000 * result.data.expires_in
        }
      });

      return result.data;
    } else {
      throw new _meteor.Meteor.Error(result.statusCode, 'Unable to exchange google refresh token.', result);
    }
  }
});