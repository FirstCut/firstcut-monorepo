"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mailer = require("/imports/api/mailer");

var _slack = require("/imports/api/slack");

var _pubsubJs = require("pubsub-js");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _velocityMeteorStubs = require("meteor/velocity:meteor-stubs");

var _testingUtils = require("/imports/api/testing-utils");

var _sinon = _interopRequireDefault(require("sinon"));

var _pipeline = require("/imports/api/pipeline");

// import { Meteor } from 'meteor/meteor';
var Cut = _firstcutModels.default.Cut,
    Deliverable = _firstcutModels.default.Deliverable,
    Project = _firstcutModels.default.Project,
    Collaborator = _firstcutModels.default.Collaborator,
    Client = _firstcutModels.default.Client,
    Shoot = _firstcutModels.default.Shoot;

var sandbox = _sinon.default.createSandbox({});

describe('Feedback sent event', function () {
  before(function () {
    _velocityMeteorStubs.MeteorStubs.install();

    (0, _testingUtils.stubUser)();
    (0, _testingUtils.insertTestData)();
  });
  afterEach(function () {
    sandbox.restore();
  });
  it('should send one slack notification',
  /*#__PURE__*/
  function () {
    var _ref = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(done) {
      var callback, mock_slack;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              callback = sandbox.spy();

              _pubsubJs.PubSub.subscribe('error', callback);

              mock_slack = sandbox.mock(_slack.Slack);
              mock_slack.expects('postMessage').once();
              (0, _pipeline.handleEvent)({
                event_data: {
                  event: 'revisions_sent',
                  record_id: _testingUtils.CUT_ID,
                  record_type: Cut.modelName
                }
              }, function () {
                expect(callback.called).to.be.false;
                mock_slack.verify();
                done();
              });

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
}); //         const retrieve_spy = sandbox.spy(Mailer.prototype, 'getSubstitutionData');
//         const send_spy = sandbox.spy(Mailer.prototype, 'send');
//         const deep_send_spy = sandbox.spy(Mailer.prototype, '_send');
//
// // const PROJECT_ID = "s4RpnMvga685mkMqT";
//
// var sandbox = sinon.createSandbox({});
//
// describe('action', function() {
//   before(function() {
//     MeteorStubs.install();
//
//     Deliverable.availableBlueprints = DELIVERABLE_BLUEPRINTS;
//     Shoot.availableBlueprints = SHOOT_BLUEPRINTS;
//     Project.availableBlueprints = PROJECT_BLUEPRINTS;
//
//     stubUser();
//     insertTestData();
//   });
//
//   after(function() {
//     MeteorStubs.uninstall();
//     // restoreTestData();
//   });
//
//   describe('posting to slack', function() {
//     afterEach(function () {
//       sandbox.restore();
//     });
//     it('should throw error when no record provided', async function(done) {
//       try {
//         let result = await sendSlackNotification(null, {template: Object.values(SLACK_TEMPLATES)[0]});
//       } catch (e) {
//         expect(e.error).to.equal('validation-error');
//         expect(e.details).to.have.length(1);
//         expect(e.details[0].name).to.equal('record');
//         done();
//       }
//     });
//     it('should throw error when action doesnt have a template', async function(done) {
//       try {
//         let deliverable = new Deliverable({projectId: PROJECT_ID});
//         let result = await sendSlackNotification(deliverable, {});
//       } catch (e) {
//         expect(e.error).to.equal('validation-error');
//         expect(e.details).to.have.length(1);
//         expect(e.details[0].name).to.equal('template');
//         done();
//       }
//     });
//     it('should call postMessage', async function(done) {
//       try {
//         let deliverable = new Deliverable({projectId: PROJECT_ID});
//         const mock_slack = sandbox.mock(Slack);
//         const expectation = mock_slack.expects('postMessage').once();
//         let result = await sendSlackNotification(deliverable, {template: Object.values(SLACK_TEMPLATES)[0]});
//         mock_slack.verify();
//         done();
//       } catch (e) {
//         done(e);
//       }
//     });
//   });
//
//   describe('sending emails', function() {
//     afterEach(function () {
//       sandbox.restore();
//     });
//     it('should throw error when no record provided', async function(done) {
//       try {
//         let result = await sendEmails(null, {to: [RECIPIENTS.postpoOwner], template: Object.values(EMAIL_TEMPLATES)[0]});
//         done();
//       } catch (e) {
//         expect(e.error).to.equal('validation-error');
//         expect(e.details).to.have.length(1);
//         expect(e.details[0].name).to.equal('record');
//         done();
//       }
//     });
//     it('should throw error when record doesnt have RECIPIENT defined', async function(done) {
//       const recipient = RECIPIENTS.postpoOwner;
//       try {
//         const record = new Record({})();
//         let result = await sendEmails(record, {to: [recipient], template: Object.values(EMAIL_TEMPLATES)[0]});
//         done();
//       } catch (e) {
//         expect(e.details).to.have.length(1);
//         expect(e.details[0].name).to.equal(`record.${recipient}`);
//         done();
//       }
//     });
//     it('should throw error when email template not supported', async function(done) {
//       try {
//         let deliverable = new Deliverable({projectId: PROJECT_ID, clientOwner: CLIENT_OWNER_ID_FOR_DELIVERABLE});
//         let result = await sendEmails(deliverable, {to: [RECIPIENTS.clientOwner], template: 'not supported template'});
//         done();
//       } catch (e) {
//         expect(e.error).to.equal('validation-error');
//         expect(e.details[0].name).to.equal('template');
//         expect(e.details).to.have.length(1);
//         done();
//       }
//     });
//     it('should throw error when recipient is not in RECIPIENTS', async function(done) {
//       try {
//         let deliverable = new Deliverable({projectId: PROJECT_ID});
//         let result = await sendEmails(deliverable, {to:['notInEmails'], template: Object.values(EMAIL_TEMPLATES)[0]});
//         done();
//       } catch (e) {
//         expect(e.error).to.equal('validation-error');
//         expect(e.details[0].name).to.equal('to.0');
//         expect(e.details).to.have.length(1);
//         done();
//       }
//     });
//     it('should call Mailer.retrieveSubstitutionData with record and recipient when all parameters correctly formatted', async function(done) {
//       try {
//         const recipients = [RECIPIENTS.clientOwner];
//         const retrieve_stub = sandbox.stub(Mailer.prototype, 'getSubstitutionData');
//         const send_stub = sandbox.stub(Mailer.prototype, 'send');
//         const client_email = 'client@email.com';
//         const template = Object.values(EMAIL_TEMPLATES)[0];
//
//         let deliverable = new Deliverable({projectId: PROJECT_ID, clientOwnerId: CLIENT_OWNER_ID_FOR_DELIVERABLE});
//         let client_owner_stub = sandbox.stub(deliverable, 'clientOwner').get(()=> new Client({email: client_email}));
//         let result = await sendEmails(deliverable, {to: recipients, template});
//
//         expect(retrieve_stub.calledOnce).to.be.true;
//         expect(send_stub.calledOnce).to.be.true;
//         expect(retrieve_stub.calledWith(deliverable, client_owner_stub));
//         expect(send_stub.calledWith(deliverable, template, client_email));
//
//         done();
//       } catch (e) {
//         done(e);
//       }
//     });
//     it('should call Mailer.getSubstitutionData and Mailer.send once for each recipient', async function(done) {
//       try {
//         const recipients = [RECIPIENTS.clientOwner, RECIPIENTS.postpoOwner];
//         const retrieve_stub = sandbox.stub(Mailer.prototype, 'getSubstitutionData');
//         const send_stub = sandbox.stub(Mailer.prototype, 'send');
//         const client_email = 'client@email.com';
//         const postpo_email = 'postpo@email.com';
//         const template = Object.values(EMAIL_TEMPLATES)[0];
//
//         let deliverable = new Deliverable({projectId: PROJECT_ID, clientOwnerId: CLIENT_OWNER_ID_FOR_DELIVERABLE});
//         let client_owner_stub = sandbox.stub(deliverable, 'clientOwner').get(()=> new Client({email: client_email}));
//         let postpo_owner_stub = sandbox.stub(deliverable, 'postpoOwner').get(()=> new Collaborator({email: postpo_email}));
//         let result = await sendEmails(deliverable, {to: recipients, template});
//
//         expect(retrieve_stub.calledTwice).to.be.true;
//         expect(send_stub.calledTwice).to.be.true;
//         expect(retrieve_stub.calledWith(deliverable, client_owner_stub));
//         expect(send_stub.calledWith(deliverable, template, client_email, postpo_email));
//
//         done();
//       } catch (e) {
//         done(e);
//       }
//     });
//     it('should call Mailer.send when all parameters correctly formatted', async function(done) {
//       try {
//         const mock_mailer = sandbox.mock(Mailer.prototype);
//         const expectation = mock_mailer.expects('send').once();
//         let deliverable = new Deliverable({projectId: PROJECT_ID, clientOwnerId: CLIENT_OWNER_ID_FOR_DELIVERABLE});
//         let stub = sandbox.stub(deliverable, 'clientOwner').get(()=> new Client({email: 'test@test.com'}));
//         let result = await sendEmails(deliverable, {to: [RECIPIENTS.clientOwner], template: Object.values(EMAIL_TEMPLATES)[0]});
//         mock_mailer.verify();
//         mock_mailer.restore();
//         done();
//       } catch (e) {
//         done(e);
//       }
//     });
//   });
//
//   describe('saving event to history', function() {
//     afterEach(function () {
//       sandbox.restore();
//     });
//     it('should throw error when no record provided', async function(done) {
//       let deliverable = new Deliverable({projectId: PROJECT_ID});
//       const faulty = {
//         event: SUPPORTED_EVENTS[0],
//         initiator: '1111111'
//       }
//
//       try {
//         await saveToHistory(faulty);
//         done()
//       } catch (e) {
//         expect(e.error).to.equal('validation-error');
//         expect(e.details[0].name).to.equal('record');
//         expect(e.details).to.have.length(1);
//         done();
//       }
//     });
//     it('should throw error when no event provided', async function(done) {
//       let deliverable = new Deliverable({projectId: PROJECT_ID});
//       const faulty = {
//         record: deliverable,
//         initiator: '1111111'
//       }
//       try {
//         await saveToHistory({...faulty});
//       } catch (e) {
//         expect(e.error).to.equal('validation-error');
//         expect(e.details[0].name).to.equal('event');
//         done();
//       }
//     });
//     it('should not throw error when no userId provided (userId optional)', async function(done) {
//       let deliverable = new Deliverable({projectId: PROJECT_ID});
//       const not_faulty = {
//         event: SUPPORTED_EVENTS[0],
//         record: deliverable,
//       }
//       try {
//         await saveToHistory(not_faulty);
//         done();
//       } catch (e) {
//         done(e);
//       }
//     });
//
//     it('should save an event to history', async function() {
//       let deliverable = new Deliverable({projectId: PROJECT_ID});
//       const test_event_1 = {
//         event: SUPPORTED_EVENTS[0],
//         initiator: '1111111'
//       }
//       deliverable = await saveToHistory({record: deliverable, ...test_event_1});
//       expect(deliverable.history.size).to.equal(1);
//       expect(deliverable.history.get(0).event).to.equal(test_event_1.event);
//       expect(deliverable.history.get(0).initiator).to.equal(test_event_1.initiator);
//       expect(deliverable.history.get(0).timestamp).to.not.equal(undefined);
//       expect(deliverable.history.get(0).timestamp).to.not.be.null;
//
//       const test_event_2 = {
//         event: SUPPORTED_EVENTS[1],
//         initiator: Meteor.userId()
//       }
//       deliverable = await saveToHistory({record: deliverable, ...test_event_2});
//       expect(deliverable.history.size).to.equal(2);
//       expect(deliverable.history.get(1).event).to.equal(test_event_2.event);
//       expect(deliverable.history.get(1).initiator).to.equal(test_event_2.initiator);
//       expect(deliverable.history.get(1).timestamp).to.not.equal(undefined);
//       expect(deliverable.history.get(1).timestamp).to.not.be.null;
//     });
//   });
//
//   describe('execution', function() {
//     afterEach(function () {
//       sandbox.restore();
//     });
//     it('should throw validation error when passed an event not in EVENTS', async function(done) {
//       try {
//         let deliverable = new Deliverable({});
//         await execute({event: 'NOT supported event', record: deliverable, initiator: CLIENT_OWNER_ID_FOR_DELIVERABLE});
//       } catch (e) {
//         expect(e.error).to.equal('validation-error');
//         expect(e.details[0].name).to.equal('event');
//         expect(e.details).to.have.length(1);
//       }
//       done();
//     });
//
//     it('should throw validation error when record not supplied', async function(done) {
//       try {
//         const result = await execute({event: SUPPORTED_EVENTS[0]});
//       } catch (e) {
//         expect(e.error).to.equal('validation-error');
//         expect(e.details[0].name).to.equal('record');
//         expect(e.details).to.have.length(1);
//       }
//       done();
//     });
//
//     it('should not throw validation error when initiator not supplied', async function(done) {
//       try {
//         let deliverable = new Deliverable({});
//         const pipeline = DELIVERABLE_PIPELINES.standard_deliverable_pipeline;
//         const event = Object.keys(pipeline)[0];
//         let stub_pipeline = sandbox.stub(deliverable, 'pipeline').get(()=> pipeline);
//         const result = await execute({event: event, record: deliverable});
//         done();
//       } catch (e) {
//         done(e);
//       }
//     });
//   });
//
// });