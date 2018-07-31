"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = InvoiceFactory;

var _firstcutUtils = require("firstcut-utils");

var _firstcutEnum = require("firstcut-enum");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function InvoiceFactory(Base, schema) {
  var Invoice =
  /*#__PURE__*/
  function (_Base) {
    _inherits(Invoice, _Base);

    function Invoice() {
      _classCallCheck(this, Invoice);

      return _possibleConstructorReturn(this, _getPrototypeOf(Invoice).apply(this, arguments));
    }

    _createClass(Invoice, [{
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