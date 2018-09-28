"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _stripe = _interopRequireDefault(require("stripe"));

var Billing =
/*#__PURE__*/
function () {
  function Billing() {
    (0, _classCallCheck2.default)(this, Billing);
    this.stripe = (0, _stripe.default)(METEOR.settings.stripe.SECRET);
  }

  (0, _createClass2.default)(Billing, [{
    key: "chargeInvoice",
    value: function () {
      var _chargeInvoice = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(invoice, token) {
        var amount, currency, description, player, charge;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                amount = invoice.amount, currency = invoice.currency, description = invoice.description;
                player = invoice.getCustomer();
                _context.next = 4;
                return this.stripe.charges.create({
                  amount: amount,
                  currency: currency,
                  description: description,
                  source: token
                });

              case 4:
                charge = _context.sent;
                console.log('the stripe charge');
                console.log(charge);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function chargeInvoice(_x, _x2) {
        return _chargeInvoice.apply(this, arguments);
      };
    }()
  }, {
    key: "createCustomer",
    value: function () {
      var _createCustomer = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(player, stripeToken) {
        var customer, playerAsCustomer;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.stripe.customers.create({
                  source: stripeToken,
                  email: player.email
                });

              case 2:
                customer = _context2.sent;
                playerAsCustomer = player.set('customerId', customer.id);
                return _context2.abrupt("return", playerAsCustomer.save());

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function createCustomer(_x3, _x4) {
        return _createCustomer.apply(this, arguments);
      };
    }()
  }]);
  return Billing;
}();

function handleError(err) {
  switch (err.type) {
    case 'StripeCardError':
      // A declined card error
      err.message; // => e.g. "Your card's expiration year is invalid."

      break;

    case 'RateLimitError':
      // Too many requests made to the API too quickly
      break;

    case 'StripeInvalidRequestError':
      // Invalid parameters were supplied to Stripe's API
      break;

    case 'StripeAPIError':
      // An error occurred internally with Stripe's API
      break;

    case 'StripeConnectionError':
      // Some kind of error occurred during the HTTPS communication
      break;

    case 'StripeAuthenticationError':
      // You probably used an incorrect API key
      break;

    default:
      // Handle any other types of unexpected errors
      break;
  }
}

var _default = Billing;
exports.default = _default;