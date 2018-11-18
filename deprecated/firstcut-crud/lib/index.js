"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initCollections = initCollections;
exports.cleanRecord = cleanRecord;
exports.validateRecord = validateRecord;
exports.saveRecord = saveRecord;

var _mdgValidatedMethod = require("mdg:validated-method");

var _mdbid = _interopRequireDefault(require("mdbid"));

var Models = null;

function initCollections(models) {
  // should also ensure that models have the features required -- validate schema and modelName
  Object.keys(models).forEach(function (key) {
    var model = models[key];

    if (!model.collection) {
      var collection = new Mongo.Collection(model.collectionName);
      collection.attachSchema(model.schema.asSchema);
      model.collection = collection;
    }

    if (model.onInitCollection) {
      model.onInitCollection();
    }
  });
  Models = models;
}

function cleanRecord(record) {
  if (!models) {
    throw new Error('models not yet initialized. call initCollections with the models to enable');
  }

  return record.schema.clean(record.toJS());
}

function validateRecord(record) {
  if (!models) {
    throw new Error('models not yet initialized. call initCollections with the models to enable');
  }

  record.schema.validate(record.toJS());
}

function saveRecord(record) {
  if (!models) {
    throw new Error('models not yet initialized. call initCollections with the models to enable');
  }

  return new Promise(function (resolve, reject) {
    var cleaned = cleanRecord(record);
    validateRecord(cleaned);
    save.call({
      record: cleaned,
      modelName: record.modelName
    }, function (err, savedRecord) {
      if (err) {
        reject(err);
      }

      var model = Models[modelName];
      resolve(Model.createNew(savedRecord));
    });
  });
}

var save = new _mdgValidatedMethod.ValidatedMethod({
  name: 'save_record',
  validate: function validate() {
    return true;
  },
  // yes bad
  run: function run(_ref) {
    var record = _ref.record,
        modelName = _ref.modelName;

    if (!record._id) {
      record._id = (0, _mdbid.default)();
    } // this.unblock();


    var collection = Models[modelName].collection;
    collection.upsert(record._id, {
      $set: record
    });
    return record;
  }
});