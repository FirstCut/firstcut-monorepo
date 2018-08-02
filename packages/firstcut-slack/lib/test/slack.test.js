"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _values = _interopRequireDefault(require("@babel/runtime/core-js/object/values"));

var _testingUtils = require("/imports/api/testing-utils");

var _velocityMeteorStubs = require("meteor/velocity:meteor-stubs");

var _firstcutModels = require("firstcut-models");

var _slack = require("../slack.js");

var _client = require("@slack/client");

var _slackEnum = require("../slack.enum.js");

var _sinon = _interopRequireDefault(require("sinon"));

var _immutable = require("immutable");

var sandbox = _sinon.default.createSandbox({});

describe('slack', function () {
  before(function () {
    _velocityMeteorStubs.MeteorStubs.install();
  });
  after(function () {
    _velocityMeteorStubs.MeteorStubs.uninstall(); // restoreTestData();

  });
  describe('getMessageContent', function () {
    afterEach(function () {
      sandbox.restore();
    });
    it('should throw validation error when template not supported', function () {
      try {
        var result = (0, _slack.getMessageContent)('fake-template', {
          'deliverable_id': 'fake'
        });
      } catch (e) {
        expect(e.error).to.equal('validation-error');
        expect(e.details[0].name).to.equal('template');
        expect(e.details).to.have.length(1);
      }
    });
    it('should not throw error when template supported', function () {
      var _arr = (0, _values.default)(_slackEnum.TEMPLATES);

      for (var _i = 0; _i < _arr.length; _i++) {
        template = _arr[_i];

        try {
          var result = (0, _slack.getMessageContent)(template, {
            deliverable_id: 'fake'
          });
        } catch (e) {
          expect(e).to.equal(undefined);
        }
      }
    });
  });
  describe('template generators', function () {
    it('should have a generator function defined for each template', function () {
      var generator_keys = (0, _keys.default)(_slackEnum.template_generators);
      var templates = (0, _values.default)(_slackEnum.TEMPLATES);
      expect(generator_keys).to.include.all.members(templates);
    });
    it('should return json that validates against the SlackTemplateSchema', function () {
      var _arr2 = (0, _values.default)(_slackEnum.template_generators);

      for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        generator = _arr2[_i2];
        var result = generator({
          deliverable_id: 'fake_id'
        });
        result.channel = (0, _slackEnum.getChannel)();
        expect(_testingUtils.validateAgainstSchema.bind(this, result, _slackEnum.SlackTemplateSchema)).to.not.throw();
      }
    });
  });
});