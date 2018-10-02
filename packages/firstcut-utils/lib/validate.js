"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureLoggedIn = void 0;

var _firstcutMeteor = require("firstcut-meteor");

var ensureLoggedIn = function ensureLoggedIn() {
  if (!Meteor.userId && !Meteor.isTest) {
    var error = {
      name: 'user',
      type: 'not-logged-in'
    };
    throw new _firstcutMeteor.ValidationError([error]);
  }
};

exports.ensureLoggedIn = ensureLoggedIn;