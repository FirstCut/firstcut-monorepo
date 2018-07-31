"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ProjectFactory;

var _firstcutEnum = require("firstcut-enum");

var _firstcutBlueprints = require("firstcut-blueprints");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function ProjectFactory(Base, schema) {
  var Project =
  /*#__PURE__*/
  function (_Base) {
    _inherits(Project, _Base);

    function Project() {
      _classCallCheck(this, Project);

      return _possibleConstructorReturn(this, _getPrototypeOf(Project).apply(this, arguments));
    }

    _createClass(Project, [{
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