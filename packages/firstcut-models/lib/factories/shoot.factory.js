"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ShootFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _firstcutEnum = require("firstcut-enum");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var _firstcutBlueprints = require("firstcut-blueprints");

var _moment = _interopRequireDefault(require("moment"));

function ShootFactory(Base, schema) {
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
        if (field == 'footageFiles') {
          var folder_name = this.generateFootageFolderName();
          return Meteor.settings.public.footage_folder + '/' + folder_name;
        } else {
          return '';
        }
      }
    }, {
      key: "newInvoice",
      value: function newInvoice() {
        return this.invoiceService.createNew({
          gigId: this._id,
          type: 'SHOOT'
        });
      }
    }, {
      key: "generateDependentRecords",
      value: function generateDependentRecords() {
        if (this.isDummy || this.project.isDummy || !this.videographerId) {
          return [];
        }

        if (this.videographerId) {
          var booking_invoice = this.newInvoice();
          booking_invoice = booking_invoice.set('payeeId', this.videographerId);
          booking_invoice = booking_invoice.set('note', 'Booking fee');
          booking_invoice = booking_invoice.set('amount', 125);
          var hourly_invoice = this.newInvoice();
          hourly_invoice = hourly_invoice.set('payeeId', this.videographerId);
          hourly_invoice = hourly_invoice.set('note', 'Hourly');
          return [hourly_invoice, booking_invoice];
        } else {
          return [];
        }
      }
    }, {
      key: "screenshotCollaborator",
      value: function screenshotCollaborator(screenshot) {
        var user = Meteor.users.findOne(screenshot.userId);
        var collaborator = user && user.profile.playerId ? this.collaboratorService.fromId(user.profile.playerId) : null; //if that didn't work, perhaps the screenshot's userId is a collaborator Id, so try to get a collaborator directly

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
      key: "getScreenshotApprovalDisplayString",
      value: function getScreenshotApprovalDisplayString(s) {
        if (this.screenshotRejected(s)) {
          return 'Rejected';
        } else if (this.screenshotApproved(s)) {
          return 'Approved';
        } else {
          return '';
        }
      }
    }, {
      key: "getScreenshotDisplayString",
      value: function getScreenshotDisplayString(s) {
        return "".concat(this.getCameraDisplayString(s), " -- ").concat(this.getVersionDisplayString(s));
      }
    }, {
      key: "getVersionDisplayString",
      value: function getVersionDisplayString(s) {
        var human_version = s.version + 1;
        return "Version ".concat(human_version);
      }
    }, {
      key: "getCameraDisplayString",
      value: function getCameraDisplayString(s) {
        return _firstcutEnum.CAMERAS[s.cameraId];
      }
    }, {
      key: "generateFootageFolderName",
      value: function generateFootageFolderName() {
        return "footage - ".concat(this.projectDisplayName, " - ").concat(this._id, "/");
      }
    }, {
      key: "latestCheckin",
      get: function get() {
        return _.last(_.sortBy(this.checkins.toArray(), ['timestamp']));
      }
    }, {
      key: "latestCheckout",
      get: function get() {
        return _.last(_.sortBy(this.checkouts.toArray(), ['timestamp']));
      }
    }, {
      key: "endDatetime",
      get: function get() {
        return (0, _moment.default)(this.date).add(this.duration, 'hours').toDate();
      }
    }, {
      key: "displayName",
      get: function get() {
        return "".concat(this.projectDisplayName, " at ").concat(this.location.name);
      }
    }, {
      key: "timezone",
      get: function get() {
        return this.location ? this.location.timezone : null;
      } // get calendarEventId() {
      //   const date_changed_events = this.history.toArray().filter(event => event.event == 'shoot_event_updated');
      //   const with_event_id = _.first(date_changed_events.filter(event => event.event_id != null));
      //   return (with_event_id)
      //     ? with_event_id.event_id
      //     : null;
      // }
      //

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
        return this.adminOwner ? this.adminOwner.displayName : "";
      }
    }, {
      key: "videographerDisplayName",
      get: function get() {
        return this.videographer ? this.videographer.displayName : "";
      }
    }, {
      key: "interviewerDisplayName",
      get: function get() {
        return this.interviewer ? this.interviewer.displayName : "";
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
      key: "stageLabel",
      get: function get() {
        return this.stage ? _firstcutEnum.SHOOT_STAGES[this.stage] : "";
      }
    }, {
      key: "hasVerifiedFootage",
      get: function get() {
        return this.eventsInHistory.includes(_firstcutEnum.EVENTS.footage_verified);
      }
    }, {
      key: "preproHasBeenKickedOff",
      get: function get() {
        return this.eventsInHistory.includes(_firstcutEnum.EVENTS.preproduction_kickoff);
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
      key: "collection_name",
      get: function get() {
        return 'shoots';
      }
    }]);
    return Shoot;
  }(Base);

  Shoot.schema = schema;
  Shoot.available_blueprints = _firstcutBlueprints.SHOOT_BLUEPRINTS;
  return Shoot;
}