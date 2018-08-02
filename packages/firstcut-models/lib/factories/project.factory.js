"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ProjectFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _firstcutEnum = require("firstcut-enum");

var _firstcutBlueprints = require("firstcut-blueprints");

function ProjectFactory(Base, schema) {
  var Project =
  /*#__PURE__*/
  function (_Base) {
    (0, _inherits2.default)(Project, _Base);

    function Project() {
      (0, _classCallCheck2.default)(this, Project);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Project).apply(this, arguments));
    }

    (0, _createClass2.default)(Project, [{
      key: "filesRoot",
      value: function filesRoot(field) {
        return this.projectDirectory + 'project_assets';
      }
    }, {
      key: "newCompany",
      value: function newCompany() {
        return this.companyService.createNew({});
      }
    }, {
      key: "newClient",
      value: function newClient() {
        return this.clientService.createNew({});
      }
    }, {
      key: "newAdminOwner",
      value: function newAdminOwner() {
        return this.collaboratorService.createNew({});
      }
    }, {
      key: "newShoot",
      value: function newShoot() {
        return this.shootService.createNew({
          projectId: this._id,
          isDummy: this.isDummy
        });
      }
    }, {
      key: "newInvoice",
      value: function newInvoice() {
        return this.invoiceService.createNew({
          gigId: this._id,
          type: 'PROJECT'
        });
      }
    }, {
      key: "generateDependentRecords",
      value: function generateDependentRecords() {
        if (!this.adminOwnerId) {
          return [];
        }

        var invoice = this.newInvoice();
        invoice = invoice.set('payeeId', this.adminOwnerId);
        return [invoice];
      }
    }, {
      key: "displayName",
      get: function get() {
        var is_dummy = '';
        if (this.isDummy) is_dummy = '(DUMMY)';
        return "".concat(this.companyDisplayName, " - ").concat(this.name, " ") + is_dummy;
      }
    }, {
      key: "projectDirectory",
      get: function get() {
        return "projects/".concat(this._id, "/");
      }
    }, {
      key: "clientOwner",
      get: function get() {
        return this.clientService.fromId(this.clientOwnerId);
      }
    }, {
      key: "adminOwner",
      get: function get() {
        return this.collaboratorService.fromId(this.adminOwnerId);
      }
    }, {
      key: "company",
      get: function get() {
        return this.companyService.fromId(this.companyId);
      }
    }, {
      key: "shoots",
      get: function get() {
        return this.shootService.find({
          projectId: this._id
        });
      }
    }, {
      key: "deliverables",
      get: function get() {
        return this.deliverableService.find({
          projectId: this._id
        });
      }
    }, {
      key: "stageLabel",
      get: function get() {
        return this.stage ? _firstcutEnum.PROJECT_STAGES[this.stage] : "";
      }
    }, {
      key: "hasBeenWrapped",
      get: function get() {
        return this.eventsInHistory.includes('project_wrap');
      }
    }], [{
      key: "collection_name",
      get: function get() {
        return 'projects';
      }
    }]);
    return Project;
  }(Base);

  Project.schema = schema;
  Project.available_blueprints = _firstcutBlueprints.PROJECT_BLUEPRINTS;
  return Project;
}