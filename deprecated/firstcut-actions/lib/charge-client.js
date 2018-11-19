"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _immutable = require("immutable");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var ChargeClient = new _immutable.Map({
  key: 'charge_client',
  action_title: 'Pay',
  completed_title: 'Paid invoice',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    return record.isClientBill();
  },
  generateActions: function generateActions(Models, eventData) {
    var record_id = eventData.record_id,
        token = eventData.token,
        initiator_player_id = eventData.initiator_player_id;
    var invoice = Models.Invoice.fromId(record_id);
    var client = invoice.getClientPayer();
    var emailActions = (0, _firstcutActionUtils.getEmailActions)({
      recipients: [client],
      cc: [invoice.gig.adminOwner],
      template: 'client-payment-successful',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          gig_name: invoice.gig.displayName,
          name: recipient.firstName,
          amount: invoice.amount
        };
      }
    });
    return (0, _toConsumableArray2.default)(emailActions).concat([{
      type: _firstcutPipelineConsts.ACTIONS.charge_invoice,
      invoice: invoice,
      token: token
    }, {
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "CLIENT PAYMENT PROCESSED: ".concat(invoice.gig.displayName, " : ").concat(client.displayName, " from ").concat(client.companyDisplayName, " has posted a payment")
      }
    }]);
  }
});
var _default = ChargeClient;
exports.default = _default;