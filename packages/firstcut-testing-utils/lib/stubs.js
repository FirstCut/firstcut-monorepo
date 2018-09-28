"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stubUser = stubUser;

var _sinon = _interopRequireDefault(require("sinon"));

function stubUser(currentUserId) {
  try {
    Meteor.userId();
  } catch (e) {
    var TEST_USER_ID = "BDBPjnXYtn4Qf4bYD";

    _sinon.default.stub(Meteor, 'userId', function () {
      return TEST_USER_ID;
    });

    _sinon.default.stub(Meteor, 'user', function () {
      return Meteor.users.findOne({
        _id: TEST_USER_ID
      });
    });
  }
}