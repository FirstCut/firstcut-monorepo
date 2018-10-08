"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateAgainstSchema = validateAgainstSchema;
Object.defineProperty(exports, "sample_deliverables", {
  enumerable: true,
  get: function get() {
    return _deliverables.default;
  }
});
Object.defineProperty(exports, "sample_cuts", {
  enumerable: true,
  get: function get() {
    return _cuts.default;
  }
});
Object.defineProperty(exports, "sample_projects", {
  enumerable: true,
  get: function get() {
    return _projects.default;
  }
});
Object.defineProperty(exports, "sample_collaborators", {
  enumerable: true,
  get: function get() {
    return _collaborators.default;
  }
});
Object.defineProperty(exports, "sample_clients", {
  enumerable: true,
  get: function get() {
    return _clients.default;
  }
});
Object.defineProperty(exports, "sample_shoots", {
  enumerable: true,
  get: function get() {
    return _shoots.default;
  }
});
Object.defineProperty(exports, "insertTestData", {
  enumerable: true,
  get: function get() {
    return _collections.insertTestData;
  }
});
Object.defineProperty(exports, "restoreTestData", {
  enumerable: true,
  get: function get() {
    return _collections.restoreTestData;
  }
});
Object.defineProperty(exports, "PROJECT_ID", {
  enumerable: true,
  get: function get() {
    return _collections.PROJECT_ID;
  }
});
Object.defineProperty(exports, "CUT_ID", {
  enumerable: true,
  get: function get() {
    return _collections.CUT_ID;
  }
});
Object.defineProperty(exports, "DELIVERABLE_ID", {
  enumerable: true,
  get: function get() {
    return _collections.DELIVERABLE_ID;
  }
});
Object.defineProperty(exports, "POSTPO_OWNER_ID", {
  enumerable: true,
  get: function get() {
    return _collections.POSTPO_OWNER_ID;
  }
});
Object.defineProperty(exports, "CLIENT_OWNER_ID_FOR_DELIVERABLE", {
  enumerable: true,
  get: function get() {
    return _collections.CLIENT_OWNER_ID_FOR_DELIVERABLE;
  }
});
Object.defineProperty(exports, "stubUser", {
  enumerable: true,
  get: function get() {
    return _stubs.stubUser;
  }
});

var _deliverables = _interopRequireDefault(require("./sample-data/deliverables.samples"));

var _cuts = _interopRequireDefault(require("./sample-data/cuts.samples"));

var _projects = _interopRequireDefault(require("./sample-data/projects.samples"));

var _collaborators = _interopRequireDefault(require("./sample-data/collaborators.samples"));

var _clients = _interopRequireDefault(require("./sample-data/clients.samples"));

var _shoots = _interopRequireDefault(require("./sample-data/shoots.samples"));

var _collections = require("./collections");

var _stubs = require("./stubs");

function validateAgainstSchema(obj, schema) {
  schema.validate(obj);
}