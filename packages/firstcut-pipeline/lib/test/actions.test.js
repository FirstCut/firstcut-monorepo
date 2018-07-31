// // import { Meteor } from 'meteor/meteor';
// import { Mailer, TEMPLATES as EMAIL_TEMPLATES } from '/imports/api/mailer';
// import { Slack, TEMPLATES as SLACK_TEMPLATES } from '/imports/api/slack';
// import { PubSub } from 'pubsub-js';
// import { init, DELIVERABLE_PIPELINES } from '../index.js';
// import { SUPPORTED_EVENTS, SUPPORTED_ACTIONS, PIPELINES, RECIPIENTS, EVENTS } from '../shared/pipeline.enum.js';
// import { Deliverable, Project, Cut, Shoot, Collaborator, Client } from 'firstcut-models';
// import { execute } from '../server/pubsub.js';
// import { handleEvent, saveToHistory, sendEmails, sendSlackNotification, executeAction } from '../server/pubsub.js';
// import { DELIVERABLE_BLUEPRINTS, SHOOT_BLUEPRINTS, PROJECT_BLUEPRINTS } from '/imports/api/blueprints';
// import { insertTestData, restoreTestData, DELIVERABLE_ID, POSTPO_OWNER_ID, PROJECT_ID, CLIENT_OWNER_ID_FOR_DELIVERABLE, stubUser } from '/imports/api/testing-utils';
// import { MeteorStubs } from 'meteor/velocity:meteor-stubs';
// import { _ } from 'lodash';
// import { Record } from 'immutable';
// import sinon from 'sinon'
//
// // const PROJECT_ID = "s4RpnMvga685mkMqT";
//
// var sandbox = sinon.createSandbox({});
//
// describe('action', function() {
//   before(function() {
//     MeteorStubs.install();
//
//     Deliverable.available_blueprints = DELIVERABLE_BLUEPRINTS;
//     Shoot.available_blueprints = SHOOT_BLUEPRINTS;
//     Project.available_blueprints = PROJECT_BLUEPRINTS;
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
"use strict";