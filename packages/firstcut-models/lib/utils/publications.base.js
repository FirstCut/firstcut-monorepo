"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = enableBasePublications;

function enableBasePublications(cls) {
  if (Meteor.isServer) {
    var name = "".concat(cls.collectionName, ".all");
    Meteor.publish(name, function () {
      return cls.collection.find({});
    });
  }
}