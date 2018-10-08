"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = enableCrud;

var _meteorStandaloneRandom = require("meteor-standalone-random");

var _record = _interopRequireDefault(require("./record.persister"));

function enableCrud(cls, ValidatedMethod) {
  var persister = new _record.default({
    cls: cls,
    namespace: cls.collectionName,
    onSave: function onSave(r) {
      return new Promise(function (resolve, reject) {
        var record = r;

        if (!record._id) {
          record._id = _meteorStandaloneRandom.Random.id();
        }

        cls._persist_save.call(record, function (err, updatedRecord) {
          if (err) reject(err); // console.log('The new record has been returned');

          var newRecord = new cls(updatedRecord);
          resolve(newRecord);
        });
      });
    },
    onRemove: function onRemove(record) {
      return new Promise(function (resolve, reject) {
        cls._persist_remove.call(record, function (err, res) {
          if (err) reject(err);
          resolve();
        });
      });
    }
  });
  var name = "".concat(cls.collectionName, ".upsert");
  cls._persist_save = new ValidatedMethod({
    name: name,
    validate: cls.schema.validator(),
    run: function run(record) {
      if (!record._id) {
        record._id = _meteorStandaloneRandom.Random.id();
      }

      this.unblock();
      cls.collection.upsert(record._id, {
        $set: record
      });
      return record;
    }
  });
  name = "".concat(cls.collectionName, ".remove");
  cls._persist_remove = new ValidatedMethod({
    name: name,
    validate: cls.schema.validator(),
    run: function run(record) {
      if (Meteor.isServer) {
        cls.collection.remove(record._id);
      }
    }
  });
  cls.persister = persister;
}