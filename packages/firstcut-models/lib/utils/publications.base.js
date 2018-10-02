"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = enableBasePublications;

var _firstcutMeteor = require("firstcut-meteor");

function enableBasePublications(cls) {
  if (_firstcutMeteor.Meteor.isServer) {
    var name = "".concat(cls.collectionName, ".all");

    _firstcutMeteor.Meteor.publish(name, function () {
      return cls.collection.find({});
    });
  }
}