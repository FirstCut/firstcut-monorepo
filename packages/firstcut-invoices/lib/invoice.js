"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _invoices = require("./invoices.enum");

var _invoices2 = _interopRequireDefault(require("./invoices.schema"));

var _modelBase = require("/imports/api/model-base");

var Base = (0, _modelBase.createFirstCutModel)(_invoices2.default);

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
    key: "isClientBill",
    value: function isClientBill() {
      return this.payerId != null;
    }
  }, {
    key: "getClientPayer",
    value: function getClientPayer() {
      if (!this.isClientBill()) {
        return null;
      }

      return this.clientService.fromId(this.payerId);
    }
  }, {
    key: "isDue",
    value: function isDue() {
      return this.status === 'DUE';
    }
  }, {
    key: "typeLabel",
    get: function get() {
      return _invoices.INVOICE_TYPES[this.type];
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

        default:
          return this.deliverableService;
      }
    }
  }, {
    key: "payee",
    get: function get() {
      if (this.isClientBill()) {
        return null;
      }

      return this.collaboratorService.fromId(this.payeeId);
    }
  }, {
    key: "payeePaymentMethodAsString",
    get: function get() {
      return this.payee.paymentMethodAsString;
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
      return this.gig ? this.gig.displayName : '';
    }
  }, {
    key: "payeeDisplayName",
    get: function get() {
      return this.payee ? this.payee.displayName : '';
    }
  }, {
    key: "statusLabel",
    get: function get() {
      return _invoices.INVOICE_STATUS[this.status];
    }
  }, {
    key: "datePaid",
    get: function get() {
      return this.date_paid;
    }
  }, {
    key: "dateDue",
    get: function get() {
      return this.date_due;
    }
  }, {
    key: "paid",
    get: function get() {
      return this.status === 'PAID';
    }
  }], [{
    key: "collectionName",
    get: function get() {
      return 'invoices';
    }
  }, {
    key: "schema",
    get: function get() {
      return _invoices2.default;
    }
  }]);
  return Invoice;
}(Base);

var _default = Invoice;
exports.default = _default;