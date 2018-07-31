"use strict";

var _meteor = require("meteor/meteor");

var _mailer = _interopRequireDefault(require("../mailer.js"));

var _testingUtils = require("/imports/api/testing-utils");

var _velocityMeteorStubs = require("meteor/velocity:meteor-stubs");

var _mailerEnum = require("../mailer.enum.js");

var _immutable = require("immutable");

var _sinon = _interopRequireDefault(require("sinon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var mailer = new _mailer.default();
describe('mailer', function () {
  before(function () {
    _velocityMeteorStubs.MeteorStubs.install();

    (0, _testingUtils.stubUser)();
    (0, _testingUtils.insertTestData)();
  });
  after(function () {
    _velocityMeteorStubs.MeteorStubs.uninstall(); // restoreTestData();

  });
  describe('getSubstitutionData', function () {
    it('should have a generator function defined for each template', function () {
      var generator_keys = Object.keys(_mailerEnum.substitution_data_generators);
      var templates = Object.values(_mailerEnum.TEMPLATES);
      expect(generator_keys).to.include.all.members(templates);
    });
    it('should throw validation error when template_id not in TEMPLATES', function () {
      var record = new _immutable.Record({})();
      var recipient = new _immutable.Record({})();

      var should_error = function should_error() {
        return mailer.getSubstitutionData(record, recipient, 'not-in-templates');
      };

      expect(should_error).to.throw();
    });
    it('should return a json object for valid empty inputs', function () {
      var record = new _immutable.Record({})();
      var recipient = new _immutable.Record({})();

      var _arr = Object.values(_mailerEnum.TEMPLATES);

      for (var _i = 0; _i < _arr.length; _i++) {
        template = _arr[_i];
        var result = mailer.getSubstitutionData(record, recipient, template);
        expect(result).to.be.an('object');
      }
    });
    it('should call the correct substitition data generator function and pass the record and recipient', function () {
      var record = new _immutable.Record({})();
      var recipient = new _immutable.Record({})();

      var _arr2 = Object.values(_mailerEnum.TEMPLATES);

      for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        template = _arr2[_i2];

        var spy = _sinon.default.spy(_mailerEnum.substitution_data_generators, template);

        var result = mailer.getSubstitutionData(record, recipient, template);
        expect(spy.called).to.be.true;
        expect(spy.calledWith(record)).to.be.true;
        expect(spy.calledWith(recipient)).to.be.true;
      }
    });
  });
  describe('send', function () {
    it('should accept optional substitution data', function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(done) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return mailer.send(Object.values(_mailerEnum.TEMPLATES)[0], [_meteor.Meteor.settings.test_email], {
                  name: "Lucy"
                });

              case 3:
                result = _context.sent;
                done();
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                done(_context.t0);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 7]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
    it('should throw validation error when emails not correctly formatted email', function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(done) {
        var result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return mailer.send(Object.values(_mailerEnum.TEMPLATES)[0], ['l']);

              case 3:
                result = _context2.sent;
                done();
                _context2.next = 13;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                expect(_context2.t0.error).to.equal('validation-error');
                expect(_context2.t0.details[0].name).to.equal('addresses.0');
                expect(_context2.t0.details).to.have.length(1);
                done();

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 7]]);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());
    it('should throw validation error when template not in allowed templates', function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(done) {
        var result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return mailer.send('not-in-allowed-templates', [_meteor.Meteor.settings.test_email]);

              case 3:
                result = _context3.sent;
                done();
                _context3.next = 13;
                break;

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3["catch"](0);
                expect(_context3.t0.error).to.equal('validation-error');
                expect(_context3.t0.details[0].name).to.equal('template_id');
                expect(_context3.t0.details).to.have.length(1);
                done();

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 7]]);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }());
    it('should succeed with allowed template_id and properly formatted emails', function () {
      var _ref4 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(done) {
        var mock_mailer, expectation, result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                mock_mailer = _sinon.default.mock(_mailer.default.prototype);
                expectation = mock_mailer.expects('_send').once();
                _context4.next = 5;
                return mailer.send(Object.values(_mailerEnum.TEMPLATES)[0], [_meteor.Meteor.settings.test_email]);

              case 5:
                result = _context4.sent;
                mock_mailer.verify();
                mock_mailer.restore();
                done();
                _context4.next = 14;
                break;

              case 11:
                _context4.prev = 11;
                _context4.t0 = _context4["catch"](0);
                done(_context4.t0);

              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 11]]);
      }));

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    }());
  });
});