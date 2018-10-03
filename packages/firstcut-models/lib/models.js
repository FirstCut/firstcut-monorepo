"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initModels = initModels;
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _firstcutCollaborators = _interopRequireDefault(require("firstcut-collaborators"));

var _firstcutCompanies = _interopRequireDefault(require("firstcut-companies"));

var _firstcutClients = _interopRequireDefault(require("firstcut-clients"));

var _firstcutShoots = _interopRequireDefault(require("firstcut-shoots"));

var _firstcutProjects = _interopRequireDefault(require("firstcut-projects"));

var _firstcutCuts = _interopRequireDefault(require("firstcut-cuts"));

var _firstcutDeliverables = _interopRequireDefault(require("firstcut-deliverables"));

var _firstcutInvoices = _interopRequireDefault(require("firstcut-invoices"));

var _firstcutJobs = _interopRequireDefault(require("firstcut-jobs"));

var _firstcutAssets = _interopRequireDefault(require("firstcut-assets"));

var _firstcutTasks = _interopRequireDefault(require("firstcut-tasks"));

var _crud = _interopRequireDefault(require("./utils/crud"));

var _publications = _interopRequireDefault(require("./utils/publications.base"));

var models = Object.freeze({
  Collaborator: _firstcutCollaborators.default,
  Task: _firstcutTasks.default,
  Client: _firstcutClients.default,
  Company: _firstcutCompanies.default,
  Project: _firstcutProjects.default,
  Shoot: _firstcutShoots.default,
  Deliverable: _firstcutDeliverables.default,
  Invoice: _firstcutInvoices.default,
  Job: _firstcutJobs.default,
  Asset: _firstcutAssets.default,
  Cut: _firstcutCuts.default
});
var Models = (0, _objectSpread2.default)({
  allModels: Object.values(models)
}, models, legacyModels, {
  getRecordFromId: function getRecordFromId(type, id) {
    var model = models[type];
    return model.fromId(id);
  },
  getRecordFromQuery: function getRecordFromQuery(type, query) {
    var model = models[type];
    return model.findOne(query);
  }
});
var legacyModels = Object.freeze({
  COLLABORATOR: _firstcutCollaborators.default,
  CLIENT: _firstcutClients.default,
  COMPANY: _firstcutCompanies.default,
  PROJECT: _firstcutProjects.default,
  SHOOT: _firstcutShoots.default,
  DELIVERABLE: _firstcutDeliverables.default,
  INVOICE: _firstcutInvoices.default,
  CUT: _firstcutCuts.default
});

function initModels(ValidatedMethod) {
  Object.keys(models).forEach(function (key) {
    var model = models[key];
    model.modelName = key;
    (0, _publications.default)(model);
    (0, _crud.default)(model, ValidatedMethod);
  }); // dependency injection solved by pulling this out into another object?

  Object.keys(models).forEach(function (i) {
    var model = models[i];
    model.models = models;
  });
}

var _default = Models;
exports.default = _default;