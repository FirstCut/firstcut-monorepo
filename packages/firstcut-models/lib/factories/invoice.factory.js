"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = InvoiceFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _firstcutUtils = require("firstcut-utils");

var _firstcutEnum = require("firstcut-enum");

function InvoiceFactory(Base, schema) {
  var Invoice =
  /*#__PURE__*/
  function (_Base) {
    (0, _inherits2.default)(Invoice, _Base);

    function Invoice() {
      (0, _classCallCheck2.default)(this, Invoice);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Invoice).apply(this, arguments));
    }

    (0, _createClass2.default)(Invoice, [{
      key: "markAsDue",
      value: function markAsDue() {
        return this.set('status', 'DUE');
      }
    }, {
      key: "markAsPaid",
      value: function markAsPaid() {
        return this.set('status', 'PAID');
      }
    }, {
      key: "typeLabel",
      get: function get() {
        return _firstcutEnum.INVOICE_TYPES[this.type];
      }
    }, {
      key: "displayName",
      get: function get() {
        return "".concat(this.typeLabel);
      }
    }, {
      key: "gigService",
      get: function get() {
        switch (this.type) {
          case 'DELIVERABLE':
            return this.deliverableService;

          case 'PROJECT':
            return this.projectService;

          case 'SHOOT':
            return this.shootService;
        }
      }
    }, {
      key: "payee",
      get: function get() {
        return this.collaboratorService.fromId(this.payeeId);
      }
    }, {
      key: "gig",
      get: function get() {
        return this.gigService.fromId(this.gigId);
      }
    }, {
      key: "adminOwnerDisplayName",
      get: function get() {
        return this.gig ? this.gig.adminOwnerDisplayName : '';
      }
    }, {
      key: "gigDisplayName",
      get: function get() {
        return this.gig ? this.gig.displayName : "";
      }
    }, {
      key: "payeeDisplayName",
      get: function get() {
        return this.payee ? this.payee.displayName : "";
      }
    }, {
      key: "statusLabel",
      get: function get() {
        return _firstcutEnum.INVOICE_STATUS[this.status];
      }
    }, {
      key: "datePaid",
      get: function get() {
        return this.date_paid;
      }
    }, {
      key: "paid",
      get: function get() {
        return this.status == 'PAID';
      }
    }], [{
      key: "collection_name",
      get: function get() {
        return 'invoices';
      }
    }]);
    return Invoice;
  }(Base);

  Invoice.schema = schema;
  return Invoice;
}