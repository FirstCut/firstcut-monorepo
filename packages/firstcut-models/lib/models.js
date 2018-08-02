"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _values = _interopRequireDefault(require("@babel/runtime/core-js/object/values"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _freeze = _interopRequireDefault(require("@babel/runtime/core-js/object/freeze"));

var _collaboratorFactory = _interopRequireDefault(require("./factories/collaborator.factory.js"));

var _companyFactory = _interopRequireDefault(require("./factories/company.factory.js"));

var _clientFactory = _interopRequireDefault(require("./factories/client.factory.js"));

var _shootFactory = _interopRequireDefault(require("./factories/shoot.factory.js"));

var _projectFactory = _interopRequireDefault(require("./factories/project.factory.js"));

var _cutFactory = _interopRequireDefault(require("./factories/cut.factory.js"));

var _deliverableFactory = _interopRequireDefault(require("./factories/deliverable.factory.js"));

var _invoiceFactory = _interopRequireDefault(require("./factories/invoice.factory.js"));

var _jobFactory = _interopRequireDefault(require("./factories/job.factory.js"));

var _assetsFactory = _interopRequireDefault(require("./factories/assets.factory.js"));

var _firstcutDataSchemas = require("firstcut-data-schemas");

var _baseModel = require("./base.model.js");

var _firstcutModel = require("./firstcut.model.js");

var _crud = require("./utils/crud.js");

var _generateDefaults = _interopRequireDefault(require("./utils/generate-defaults.js"));

var CollaboratorBase = (0, _firstcutModel.FirstCutModel)((0, _generateDefaults.default)(_firstcutDataSchemas.CollaboratorSchema)); // const CollaboratorBase = FirstCutModel(generateImmutableDefaults(PublicCollaboratorSchema));

var ClientBase = (0, _firstcutModel.FirstCutModel)((0, _generateDefaults.default)(_firstcutDataSchemas.ClientSchema));
var ShootBase = (0, _firstcutModel.FirstCutModel)((0, _generateDefaults.default)(_firstcutDataSchemas.ShootSchema));
var CutBase = (0, _firstcutModel.FirstCutModel)((0, _generateDefaults.default)(_firstcutDataSchemas.CutSchema));
var DeliverableBase = (0, _firstcutModel.FirstCutModel)((0, _generateDefaults.default)(_firstcutDataSchemas.DeliverableSchema));
var CompanyBase = (0, _firstcutModel.FirstCutModel)((0, _generateDefaults.default)(_firstcutDataSchemas.CompanySchema));
var ProjectBase = (0, _firstcutModel.FirstCutModel)((0, _generateDefaults.default)(_firstcutDataSchemas.ProjectSchema));
var InvoiceBase = (0, _firstcutModel.FirstCutModel)((0, _generateDefaults.default)(_firstcutDataSchemas.InvoiceSchema));
var JobBase = (0, _baseModel.BaseModel)((0, _generateDefaults.default)(_firstcutDataSchemas.JobSchema));
var AssetBase = (0, _firstcutModel.FirstCutModel)((0, _generateDefaults.default)(_firstcutDataSchemas.AssetSchema));
var Asset = (0, _assetsFactory.default)(AssetBase, _firstcutDataSchemas.AssetSchema);
var Collaborator = (0, _collaboratorFactory.default)(CollaboratorBase, _firstcutDataSchemas.CollaboratorSchema);
var Client = (0, _clientFactory.default)(ClientBase, _firstcutDataSchemas.ClientSchema);
var Shoot = (0, _shootFactory.default)(ShootBase, _firstcutDataSchemas.ShootSchema);
var Cut = (0, _cutFactory.default)(CutBase, _firstcutDataSchemas.CutSchema);
var Deliverable = (0, _deliverableFactory.default)(DeliverableBase, _firstcutDataSchemas.DeliverableSchema);
var Company = (0, _companyFactory.default)(CompanyBase, _firstcutDataSchemas.CompanySchema);
var Project = (0, _projectFactory.default)(ProjectBase, _firstcutDataSchemas.ProjectSchema);
var Invoice = (0, _invoiceFactory.default)(InvoiceBase, _firstcutDataSchemas.InvoiceSchema);
var Job = (0, _jobFactory.default)(JobBase, _firstcutDataSchemas.JobSchema);
var models = (0, _freeze.default)({
  Collaborator: Collaborator,
  Client: Client,
  Company: Company,
  Project: Project,
  Shoot: Shoot,
  Deliverable: Deliverable,
  Invoice: Invoice,
  Job: Job,
  Asset: Asset,
  Cut: Cut
});
var asset = new Asset({});
var legacy_models = (0, _freeze.default)({
  'COLLABORATOR': Collaborator,
  'CLIENT': Client,
  'COMPANY': Company,
  'PROJECT': Project,
  'SHOOT': Shoot,
  'DELIVERABLE': Deliverable,
  'INVOICE': Invoice,
  'CUT': Cut
});
(0, _keys.default)(models).forEach(function (key) {
  var model = models[key];
  model.model_name = key; // enableBasePublications(model);

  (0, _crud.enableCrud)(model);
}); // dependency injection solved by pulling this out into another object?

(0, _keys.default)(models).forEach(function (i) {
  var model = models[i];
  model.models = models;
});
var Models = (0, _objectSpread2.default)({
  allModels: (0, _values.default)(models)
}, models, legacy_models, {
  getRecordFromId: function getRecordFromId(type, id) {
    var model = models[type];
    return model.fromId(id);
  }
});
var _default = Models;
exports.default = _default;