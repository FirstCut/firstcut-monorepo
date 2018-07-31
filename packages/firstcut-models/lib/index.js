"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Models", {
  enumerable: true,
  get: function get() {
    return _models.default;
  }
});
Object.defineProperty(exports, "generateImmutableDefaults", {
  enumerable: true,
  get: function get() {
    return _generateDefaults.default;
  }
});
Object.defineProperty(exports, "RecordWithSchemaFactory", {
  enumerable: true,
  get: function get() {
    return _factories.default;
  }
});
Object.defineProperty(exports, "SaveableRecord", {
  enumerable: true,
  get: function get() {
    return _factories.SaveableRecord;
  }
});
Object.defineProperty(exports, "BaseModel", {
  enumerable: true,
  get: function get() {
    return _baseModel.BaseModel;
  }
});
Object.defineProperty(exports, "RecordPersister", {
  enumerable: true,
  get: function get() {
    return _recordPersister.default;
  }
});

var _models = _interopRequireDefault(require("./models.js"));

var _generateDefaults = _interopRequireDefault(require("./utils/generate-defaults.js"));

var _factories = _interopRequireWildcard(require("./utils/factories.js"));

var _baseModel = require("./base.model.js");

var _recordPersister = _interopRequireDefault(require("./utils/record.persister.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }