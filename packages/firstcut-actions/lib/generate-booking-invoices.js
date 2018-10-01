"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchema = require("firstcut-schema");

var _firstcutFilestore = require("firstcut-filestore");

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var _moment = _interopRequireDefault(require("moment"));

var key = 'generate_booking_invoices';
var GenerateBookingInvoices = new _immutable.Map({
  key: key,
  action_title: 'Generate Booking Invoices',
  completed_title: 'Generated booking invoices',
  customFieldsSchema: new _firstcutSchema.SimpleSchemaWrapper({
    generateInterviewerBookingInvoice: {
      type: Boolean,
      defaultValue: true
    },
    generateVideographerBookingInvoice: {
      type: Boolean,
      defaultValue: true
    }
  }),
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;

    // return true;
    if (!record.date || !record.timezone) {
      return true;
    }

    var dayOfShoot = _moment.default.tz(record.date, record.timezone);

    return (0, _moment.default)().isBefore(dayOfShoot);
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id,
        generateVideographerBookingInvoice = eventData.generateVideographerBookingInvoice,
        generateInterviewerBookingInvoice = eventData.generateInterviewerBookingInvoice,
        initiator_player_id = eventData.initiator_player_id;

    var shoot = _firstcutModels.default.getRecordFromId('Shoot', record_id);

    return [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "Generated booking invoices for ".concat(shoot.projectDisplayName, " ( ").concat((0, _firstcutRetrieveUrl.getRecordUrl)(shoot), " )")
      }
    }, {
      type: _firstcutPipelineConsts.ACTIONS.custom_function,
      title: 'generate booking invoices and set them to due',
      execute: function execute() {
        var bookingInvoices = [];

        if (shoot.videographer && generateVideographerBookingInvoice === 'true') {
          bookingInvoices.push(shoot.generateBookingInvoice(shoot.videographer));
        }

        if (shoot.interviewer && generateInterviewerBookingInvoice === 'true') {
          bookingInvoices.push(shoot.generateBookingInvoice(shoot.interviewer));
        }

        bookingInvoices.forEach(function (i) {
          var invoice = i;

          if (invoice) {
            invoice = invoice.markAsDue();
          }

          invoice.save();
        });
      }
    }];
  }
});
var _default = GenerateBookingInvoices;
exports.default = _default;