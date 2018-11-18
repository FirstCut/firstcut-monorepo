"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateStage = calculateStage;
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _lodash = require("lodash");

var _immutable = require("immutable");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutModelBase = require("firstcut-model-base");

var _projects = require("./projects.enum");

var _projects2 = _interopRequireDefault(require("./projects.blueprints"));

var _projects3 = _interopRequireDefault(require("./projects.schema"));

var Base = (0, _firstcutModelBase.createFirstCutModel)(_projects3.default);

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
      if (field === 'projectArchive') {
        return "".concat(this.projectDirectory, "archive");
      }

      return "".concat(this.projectDirectory, "project_assets");
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
    key: "numUnreadMessages",
    value: function numUnreadMessages(playerId) {
      return this.getUnreadMessages(playerId).length;
    }
  }, {
    key: "getUnreadMessages",
    value: function getUnreadMessages(playerId) {
      var messages = this.getProjectMessages();
      return _lodash._.filter(messages.toArray(), function (m) {
        return !m.getReadBy().includes(playerId);
      });
    }
  }, {
    key: "getProjectMessages",
    value: function getProjectMessages() {
      return this.messageService.find({
        projectId: this._id
      });
    }
  }, {
    key: "getCompleteRecordAndChildrenTasks",
    value: function getCompleteRecordAndChildrenTasks(options) {
      var deliverables = this.getDeliverables().toArray();
      var deliverableTasks = deliverables.map(function (d) {
        return d.getRelatedTasks(options).toArray();
      });
      var cutTasks = this.getAllCuts().toArray().map(function (c) {
        return c.getRelatedTasks(options).toArray();
      });
      var shoots = this.getShoots().toArray();
      var shootsTasks = shoots.map(function (s) {
        return s.getRelatedTasks(options).toArray();
      });
      shootsTasks = _lodash._.flatten(shootsTasks);
      deliverableTasks = _lodash._.flatten(deliverableTasks);
      cutTasks = _lodash._.flatten(cutTasks);
      var allTasks = (0, _toConsumableArray2.default)(this.getRelatedTasks(options).toArray()).concat((0, _toConsumableArray2.default)(shootsTasks), (0, _toConsumableArray2.default)(deliverableTasks), (0, _toConsumableArray2.default)(cutTasks));
      return new _immutable.List(allTasks);
    }
  }, {
    key: "hasBeenWrapped",
    value: function hasBeenWrapped() {
      return this.eventsInHistory.includes('project_wrap');
    }
  }, {
    key: "getShoots",
    value: function getShoots() {
      return this.shootService.find({
        projectId: this._id
      });
    }
  }, {
    key: "getDeliverables",
    value: function getDeliverables() {
      return this.deliverableService.find({
        projectId: this._id
      });
    }
  }, {
    key: "getAdditionalClientTeamMembers",
    value: function getAdditionalClientTeamMembers() {
      var _this = this;

      if (!this.additionalClientTeamMemberIds) {
        return new _immutable.List();
      }

      return new _immutable.List(this.additionalClientTeamMemberIds.map(function (_id) {
        return _this.clientService.fromId(_id);
      }));
    }
  }, {
    key: "getClientTeamMembersNotYetInvited",
    value: function getClientTeamMembersNotYetInvited() {
      return this.getEntireClientTeam().filter(function (c) {
        return !c.hasBeenInvitedToPlatform() && !c.hasUserProfile;
      });
    }
  }, {
    key: "getEntireClientTeam",
    value: function getEntireClientTeam() {
      return [this.clientOwner].concat((0, _toConsumableArray2.default)(this.getAdditionalClientTeamMembers()));
    }
  }, {
    key: "getAllCuts",
    value: function getAllCuts() {
      var cuts = this.getDeliverables().toArray().map(function (d) {
        return d.getCuts().toArray();
      });
      cuts = _lodash._.flatten(cuts);
      return new _immutable.List(cuts);
    }
  }, {
    key: "getLatestCuts",
    value: function getLatestCuts() {
      var cuts = this.getDeliverables().toArray().map(function (d) {
        return d.getLatestCut();
      });
      cuts = cuts.filter(function (c) {
        return c != null;
      });
      return new _immutable.List(cuts);
    }
  }, {
    key: "isWrapped",
    value: function isWrapped() {
      return this.getLatestKeyEvent() === 'PROJECT_WRAPPED';
    }
  }, {
    key: "getLatestKeyEvent",
    value: function getLatestKeyEvent() {
      var history = this.completeRecordAndChildrenHistory.toArray();

      if (history && history.length === 0) {
        return this.get('stage');
      }

      var stage = calculateStage(history);
      return stage;
    }
  }, {
    key: "completeRecordAndChildrenHistory",
    get: function get() {
      var processChildEvent = function processChildEvent(event, genTitle) {
        var e = event;

        if (e.toJS) {
          e = e.toJS();
        }

        e.title = genTitle(e);
        return e;
      };

      var deliverables = this.getDeliverables().toArray();
      var deliverableHistory = deliverables.map(function (d) {
        return d.completeRecordAndChildrenHistory.toArray().map(function (event) {
          var genTitle = function genTitle(e) {
            return "".concat(_firstcutPipelineConsts.EVENT_LABELS[e.event], " -- ").concat(d.displayName);
          };

          return processChildEvent(event, genTitle);
        });
      });
      var shoots = this.getShoots().toArray();
      var shootsHistory = shoots.map(function (s) {
        return s.history.map(function (event) {
          var genTitle = function genTitle(e) {
            return "".concat(_firstcutPipelineConsts.EVENT_LABELS[e.event], " -- ").concat(s.displayName);
          };

          return processChildEvent(event, genTitle);
        });
      });
      shootsHistory = _lodash._.flatten(shootsHistory);
      deliverableHistory = _lodash._.flatten(deliverableHistory);
      var allEvents = (0, _toConsumableArray2.default)(this.historyAsArray).concat((0, _toConsumableArray2.default)(shootsHistory), (0, _toConsumableArray2.default)(deliverableHistory));

      var sorted = _lodash._.sortBy(allEvents, ['timestamp']);

      return new _immutable.List(sorted);
    }
  }, {
    key: "displayName",
    get: function get() {
      var isDummy = '';
      if (this.isDummy) isDummy = '(DUMMY)';
      return "".concat(this.companyDisplayName, " - ").concat(this.name, " ").concat(isDummy);
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
    key: "latestKeyEventLabel",
    get: function get() {
      return _projects.STAGES[this.getLatestKeyEvent()];
    }
  }], [{
    key: "collectionName",
    get: function get() {
      return 'projects';
    }
  }, {
    key: "schema",
    get: function get() {
      return _projects3.default;
    }
  }]);
  return Project;
}(Base);

Project.availableBlueprints = _projects2.default;

function calculateStage(h) {
  var history = h; // ensure the history is sorted by timestamp

  history = _lodash._.reverse(_lodash._.sortBy(history, ['timestamp']));
  var events = (0, _firstcutActionUtils.eventsInHistory)(history);

  var findLatestEvent = function findLatestEvent(historyToSearch, eventsToFind) {
    var latest = _lodash._.find(historyToSearch, function (e) {
      return eventsToFind.includes(e.event);
    });

    return latest ? latest.event : null;
  };

  var keyEvents = ['revisions_sent', 'cut_uploaded', 'cut_approved_by_client', 'feedback_submitted_by_client', 'send_cut_to_client', 'shoot_checkin', 'shoot_wrap', 'confirm_footage_uploaded', 'preproduction_kickoff', 'deliverable_kickoff', 'footage_verified'];
  var latestKeyEvent = findLatestEvent(history, keyEvents);

  if (events.includes('project_wrap')) {
    return 'PROJECT_WRAPPED';
  }

  switch (latestKeyEvent) {
    case 'revisions_sent':
      return 'EDITOR_WORKING_ON_CUT';

    case 'cut_approved_by_client':
      return 'CLIENT_APPROVED_CUT';

    case 'feedback_submitted_by_client':
      return 'CLIENT_RESPONDED_TO_CUT';

    case 'send_cut_to_client':
      return 'CUT_SENT_TO_CLIENT';

    case 'cut_uploaded':
      return 'CUT_UPLOADED';

    case 'confirm_footage_uploaded':
      return 'FOOTAGE_UPLOADED';

    case 'footage_verified':
      return 'FOOTAGE_VERIFIED';

    case 'shoot_wrap':
      return 'SHOOT_COMPLETED';

    case 'shoot_checkin':
      return 'SHOOT_IN_PROGRESS';

    case 'deliverable_kickoff':
      return 'POSTPRODUCTION_KICKOFF';

    case 'preproduction_kickoff':
      return 'SHOOT_READY';

    default:
      return 'BOOKING';
  }
}

var _default = Project;
exports.default = _default;