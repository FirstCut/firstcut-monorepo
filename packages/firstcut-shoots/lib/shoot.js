"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _meteor = require("meteor/meteor");

var _moment = _interopRequireDefault(require("moment"));

var _lodash = require("lodash");

var _shoots = require("./shoots.enum");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var _shoots2 = _interopRequireDefault(require("./shoots.blueprints"));

var _shoots3 = _interopRequireDefault(require("./shoots.schema"));

var _modelBase = require("/imports/api/model-base");

var Base = (0, _modelBase.createFirstCutModel)(_shoots3.default);

var Shoot =
/*#__PURE__*/
function (_Base) {
  (0, _inherits2.default)(Shoot, _Base);

  function Shoot() {
    (0, _classCallCheck2.default)(this, Shoot);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Shoot).apply(this, arguments));
  }

  (0, _createClass2.default)(Shoot, [{
    key: "filesRoot",
    value: function filesRoot(field) {
      if (field === 'footageFiles') {
        var folderName = this.generateFootageFolderName();
        return "".concat(_meteor.Meteor.settings.public.footage_folder, "/").concat(folderName);
      }

      return '';
    }
  }, {
    key: "newInvoice",
    value: function newInvoice() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return this.invoiceService.createNew((0, _objectSpread2.default)({
        gigId: this._id,
        type: 'SHOOT'
      }, props));
    }
  }, {
    key: "isBookingFeeInvoice",
    value: function isBookingFeeInvoice() {
      return this.invoiceService.find({
        gigId: this._id,
        note: {
          $regex: /[Bb]ooking/
        }
      });
    }
  }, {
    key: "getBookingFeeInvoices",
    value: function getBookingFeeInvoices() {
      return this.invoiceService.find({
        gigId: this._id,
        note: {
          $regex: /[Bb]ooking/
        }
      });
    }
  }, {
    key: "meetsRequirementsForGeneratedInvoices",
    value: function meetsRequirementsForGeneratedInvoices() {
      if (this.isDummy || this.project.isDummy || !this.videographerId) {
        return false;
      }

      return true;
    }
  }, {
    key: "getBehindTheScenesShots",
    value: function getBehindTheScenesShots() {
      return this.screenshots.filter(function (s) {
        return isBehindTheScenesCamId(s.cameraId);
      });
    }
  }, {
    key: "getFramingShots",
    value: function getFramingShots() {
      return this.screenshots.filter(function (s) {
        return !isBehindTheScenesCamId(s.cameraId);
      });
    }
  }, {
    key: "generateHourlyInvoice",
    value: function generateHourlyInvoice(collaborator) {
      if (!this.meetsRequirementsForGeneratedInvoices()) {
        return null;
      }

      return this.newInvoice({
        payeeId: collaborator._id,
        note: 'Hourly'
      });
    }
  }, {
    key: "generateBookingInvoice",
    value: function generateBookingInvoice(collaborator) {
      if (!this.meetsRequirementsForGeneratedInvoices()) {
        return null;
      }

      return this.newInvoice({
        payeeId: collaborator._id,
        note: 'Booking fee',
        amount: 125
      });
    }
  }, {
    key: "screenshotCollaborator",
    value: function screenshotCollaborator(screenshot) {
      var user = _meteor.Meteor.users.findOne(screenshot.userId);

      var collaborator = user && user.profile.playerId ? this.collaboratorService.fromId(user.profile.playerId) : null; // if that didn't work, perhaps the screenshot's userId is a
      // collaborator Id, so try to get a collaborator directly

      if (!user) {
        collaborator = this.collaboratorService.fromId(screenshot.userId);
      }

      return collaborator;
    }
  }, {
    key: "headshotURL",
    value: function headshotURL(filename) {
      return this.constructor.headshotURL(filename);
    }
  }, {
    key: "screenshotURL",
    value: function screenshotURL(filename) {
      return this.constructor.screenshotURL(filename);
    }
  }, {
    key: "getScreenshotApprovalDisplayString",
    value: function getScreenshotApprovalDisplayString(s) {
      if (this.constructor.screenshotRejected(s)) {
        return 'Rejected';
      }

      if (this.constructor.screenshotApproved(s)) {
        return 'Approved';
      }

      return '';
    }
  }, {
    key: "generateFootageFolderName",
    value: function generateFootageFolderName() {
      return "footage - ".concat(this.projectDisplayName, " - ").concat(this._id, "/");
    }
  }, {
    key: "latestCheckin",
    get: function get() {
      return _lodash._.last(_lodash._.sortBy(this.checkins.toArray(), ['timestamp']));
    }
  }, {
    key: "latestCheckout",
    get: function get() {
      return _lodash._.last(_lodash._.sortBy(this.checkouts.toArray(), ['timestamp']));
    }
  }, {
    key: "endDatetime",
    get: function get() {
      return (0, _moment.default)(this.date).add(this.duration, 'hours').toDate();
    }
  }, {
    key: "displayName",
    get: function get() {
      var name = this.projectDisplayName;

      if (this.location.name) {
        name += " at ".concat(this.location.name);
      }

      return name;
    }
  }, {
    key: "timezone",
    get: function get() {
      return this.location ? this.location.timezone : null;
    }
  }, {
    key: "project",
    get: function get() {
      return this.projectService.fromId(this.projectId);
    }
  }, {
    key: "videographer",
    get: function get() {
      return this.collaboratorService.fromId(this.videographerId);
    }
  }, {
    key: "interviewer",
    get: function get() {
      return this.collaboratorService.fromId(this.interviewerId);
    }
  }, {
    key: "company",
    get: function get() {
      return this.project ? this.project.company : null;
    }
  }, {
    key: "adminOwner",
    get: function get() {
      return this.project ? this.project.adminOwner : null;
    }
  }, {
    key: "clientOwner",
    get: function get() {
      return this.project ? this.project.clientOwner : null;
    }
  }, {
    key: "adminOwnerDisplayName",
    get: function get() {
      return this.adminOwner ? this.adminOwner.displayName : '';
    }
  }, {
    key: "videographerDisplayName",
    get: function get() {
      return this.videographer ? this.videographer.displayName : '';
    }
  }, {
    key: "interviewerDisplayName",
    get: function get() {
      return this.interviewer ? this.interviewer.displayName : '';
    }
  }, {
    key: "videographerSlackHandle",
    get: function get() {
      if (!this.videographer) {
        return '';
      }

      return this.videographer.slackHandle ? this.videographer.slackHandle : this.videographer.firstName;
    }
  }, {
    key: "interviewerSlackHandle",
    get: function get() {
      if (!this.interviewer) {
        return '';
      }

      return this.interviewer.slackHandle ? this.interviewer.slackHandle : this.interviewer.firstName;
    }
  }, {
    key: "latestKeyEventLabel",
    get: function get() {
      return this.stage ? _shoots.STAGES[this.stage] : '';
    }
  }, {
    key: "hasVerifiedFootage",
    get: function get() {
      return this.eventsInHistory.includes(_firstcutPipelineConsts.EVENTS.footage_verified);
    }
  }, {
    key: "preproHasBeenKickedOff",
    get: function get() {
      return this.eventsInHistory.includes(_firstcutPipelineConsts.EVENTS.preproduction_kickoff);
    }
  }], [{
    key: "headshotURL",
    value: function headshotURL(filename) {
      return (0, _firstcutRetrieveUrl.getHeadshotURL)(filename);
    }
  }, {
    key: "screenshotURL",
    value: function screenshotURL(filename) {
      return (0, _firstcutRetrieveUrl.getScreenshotURL)(filename);
    }
  }, {
    key: "screenshotRejected",
    value: function screenshotRejected(s) {
      return s.notes != null;
    }
  }, {
    key: "screenshotApproved",
    value: function screenshotApproved(s) {
      return s.approved === true;
    }
  }, {
    key: "getScreenshotDisplayString",
    value: function getScreenshotDisplayString(s) {
      return "".concat(this.getCameraDisplayString(s), " -- ").concat(this.getVersionDisplayString(s));
    }
  }, {
    key: "getVersionDisplayString",
    value: function getVersionDisplayString(s) {
      var humanVersion = s.version + 1;
      return "Version ".concat(humanVersion);
    }
  }, {
    key: "getCameraDisplayString",
    value: function getCameraDisplayString(s) {
      return _shoots.CAMERAS[s.cameraId];
    }
  }, {
    key: "collectionName",
    get: function get() {
      return 'shoots';
    }
  }, {
    key: "schema",
    get: function get() {
      return _shoots3.default;
    }
  }]);
  return Shoot;
}(Base);

function isBehindTheScenesCamId(id) {
  console.log(id);
  return id && id.match(/behindTheScenes/) != null;
}

Shoot.availableBlueprints = _shoots2.default;
var _default = Shoot;
exports.default = _default;