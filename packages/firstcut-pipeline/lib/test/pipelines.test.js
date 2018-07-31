// import { Meteor } from 'meteor/meteor';
// import { Models } from 'firstcut-models';
// import { PubSub } from 'pubsub-js';
// import { DELIVERABLE_BLUEPRINTS, SHOOT_BLUEPRINTS, PROJECT_BLUEPRINTS } from '/imports/api/blueprints';
// import { DELIVERABLE_ID, POSTPO_OWNER_ID, PROJECT_ID, CLIENT_OWNER_ID_FOR_DELIVERABLE, stubUser, validateAgainstSchema, insertTestData } from '/imports/api/testing-utils';
// import { SUPPORTED_EVENTS, SUPPORTED_ACTIONS, ACTIONS, EVENTS } from '../shared/pipeline.enum.js';
// import { EmailActionSchema, SlackActionSchema, EventDataSchemas } from '../shared/pipeline.schemas.js';
// import { MeteorStubs } from 'meteor/velocity:meteor-stubs';
// import { init } from '../index.js';
// import Pipeline, { ALL_PIPELINES } from '../pipeline.js';
// import { execute } from '../server/pubsub.js';
// import { Mailer } from '/imports/api/mailer';
// import { Slack } from '/imports/api/slack';
// import sinon from 'sinon';
// import { Record } from 'immutable';
//
// const { Deliverable, Cut, Shoot, Project, Collaborator, Client } = Models;
//
// var sandbox = sinon.createSandbox({});
//
// describe.only('pipeline', function() {
//   before(function() {
//     MeteorStubs.install();
//
//     Deliverable.available_blueprints = DELIVERABLE_BLUEPRINTS;
//     Shoot.available_blueprints = SHOOT_BLUEPRINTS;
//     Project.available_blueprints = PROJECT_BLUEPRINTS;
//
//     insertTestData();
//     stubUser();
//   });
//
//   after(function() {
//     MeteorStubs.uninstall();
//     // restoreTestData();
//   });
//
//   describe('initialization', function() {
//     it('should initialize without error', function() {
//       expect(()=> init({Deliverable})).to.not.throw();
//     });
//   });
//
//   describe('structure', function() {
//     describe('event data schemas', function() {
//       it('should have a data schema per event', function() {
//         for (event of SUPPORTED_EVENTS) {
//           expect(EventDataSchemas[event]).to.not.equal(undefined);
//         }
//       });
//     });
//
//     describe('actions', function() {
//       afterEach(function () {
//         sandbox.restore();
//       });
//       it('should not include any unsupported action types', function() {
//         Object.values(ALL_PIPELINES).forEach(function(pipeline) {
//           SUPPORTED_EVENTS.forEach(function(event) {
//             try {
//               const stub = sandbox.stub(Pipeline.prototype.constructor, 'getPipeline').returns(pipeline);
//               const pipeline_actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record:new Record({})(), event});
//               const types = pipeline_actions.map(a => a.type);
//               expect(SUPPORTED_ACTIONS).to.include.members(types);
//               sandbox.restore();
//             } catch (e) {
//               console.log(e);
//             }
//           });
//         })
//       });
//
//       it('should not include any undefined properties', function() {
//         Object.values(ALL_PIPELINES).forEach(function(pipeline) {
//           SUPPORTED_EVENTS.forEach(function(event) {
//             const stub = sandbox.stub(Pipeline.prototype.constructor, 'getPipeline').returns(pipeline);
//             const pipeline_actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record:new Record({})(), event});
//             const types = pipeline_actions.forEach(a => {
//               Object.values(a).forEach(val => expect(val).to.not.equal(undefined));
//             });
//             sandbox.restore();
//           });
//         })
//       });
//
//       it('should validate against the EmailActionSchema for each action of type send_email', function() {
//         Object.values(ALL_PIPELINES).forEach(function(pipeline) {
//           SUPPORTED_EVENTS.forEach(function(event) {
//             const stub = sandbox.stub(Pipeline.prototype.constructor, 'getPipeline').returns(pipeline);
//             const pipeline_actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record:new Record({})(), event});
//             let send_email_actions = pipeline_actions.filter(a => a.type == ACTIONS.send_email);
//             send_email_actions.forEach(a => {
//               expect(validateAgainstSchema.bind(this, a, EmailActionSchema)).to.not.throw();
//             });
//             sandbox.restore();
//           });
//         })
//       });
//
//       it('should validate against the SlackActionSchema for each action of type slack_notify', function() {
//         Object.values(ALL_PIPELINES).forEach(function(pipeline) {
//           SUPPORTED_EVENTS.forEach(function(event) {
//             const stub = sandbox.stub(Pipeline.prototype.constructor, 'getPipeline').returns(pipeline);
//             const pipeline_actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record:new Record({})(), event});
//             let slack_notify_actions = pipeline_actions.filter(a => a.type == ACTIONS.slack_notify);
//             slack_notify_actions.forEach(a => {
//               expect(validateAgainstSchema.bind(this, a, SlackActionSchema)).to.not.throw();
//             });
//             sandbox.restore();
//           });
//         })
//       });
//     });
//   });
//
//   describe('event emitting', function() {
//     describe('all events', function() {
//       afterEach(function () {
//         sandbox.restore();
//       });
//       it('should call Model.getRecordFromId for each event published', function() {
//         const event_data = {deliverable_id: 'deliverable_id', cut_id: 'cut_id'};
//         for (event of SUPPORTED_EVENTS) {
//           let spy = sandbox.spy(Models, 'getRecordFromId');
//           PubSub.publishSync(event, event_data);
//           expect(spy.calledOnce);
//           spy.restore();
//         }
//       });
//     });
//
//     describe('cut uploaded', function() {
//       afterEach(function () {
//         sandbox.restore();
//       });
//
//       it('should call mailer send on execute', async function(done) {
//         const cut_id = 'cut_id';
//         const deliverable_id = 'deliverable_id';
//         const initiator = 'initiator_id';
//         const event = EVENTS.cut_uploaded;
//         const cut = new Cut({_id: cut_id});
//         const deliverable = new Deliverable({_id: deliverable_id});
//
//         const retrieve_spy = sandbox.spy(Mailer.prototype, 'getSubstitutionData');
//         const send_spy = sandbox.spy(Mailer.prototype, 'send');
//         const deep_send_spy = sandbox.spy(Mailer.prototype, '_send');
//
//         const collaborator = new Collaborator({email: Meteor.settings.public.test_email});
//         const client = new Client({email: Meteor.settings.public.test_email});
//         const get_deliverable_stub = sandbox.stub(cut, 'deliverable').get(()=> deliverable);
//         const display_name_stub = sandbox.stub(deliverable, 'displayName').get(()=> 'Test Deliverable Display Name');
//         const collaborator_name = sandbox.stub(collaborator, 'displayName').get(()=> 'Test PostPo Owner Display Name');
//         const client_name = sandbox.stub(client, 'displayName').get(()=> 'Test Client Owner Display Name');
//         const postpoOwnerStub = sandbox.stub(deliverable, 'postpoOwner').get(()=> collaborator);
//         const clientOwnerStub = sandbox.stub(deliverable, 'clientOwner').get(()=> client);
//
//         const actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record: deliverable, event});
//         const event_data = {cut_id: cut_id, initiator: initiator, event};
//         try {
//           await execute({event_data, record: deliverable, actions});
//           expect(send_spy.called).to.be.true;
//           expect(deep_send_spy.called).to.be.true;
//           expect(retrieve_spy.called).to.be.true;
//           done();
//         } catch (e) {
//           done(e);
//         }
//       });
//
//       it('should call slack notify on execute', async function(done) {
//         const cut_id = 'cut_id';
//         const deliverable_id = 'deliverable_id';
//         const initiator = 'initiator_id';
//         const event = EVENTS.cut_uploaded;
//         const cut = new Cut({_id: cut_id});
//         const deliverable = new Deliverable({_id: deliverable_id});
//
//         const post_msg_spy = sandbox.spy(Slack, 'postMessage');
//         const msg_content_spy = sandbox.spy(Slack, 'getMessageContent');
//
//         const collaborator = new Collaborator({email: Meteor.settings.public.test_email});
//         const client = new Client({email: Meteor.settings.public.test_email});
//         const get_deliverable_stub = sandbox.stub(cut, 'deliverable').get(()=> deliverable);
//         const display_name_stub = sandbox.stub(deliverable, 'displayName').get(()=> 'Test Deliverable Display Name');
//         const collaborator_name = sandbox.stub(collaborator, 'displayName').get(()=> 'Test PostPo Owner Display Name');
//         const client_name = sandbox.stub(client, 'displayName').get(()=> 'Test Client Owner Display Name');
//         const postpoOwnerStub = sandbox.stub(deliverable, 'postpoOwner').get(()=> collaborator);
//         const clientOwnerStub = sandbox.stub(deliverable, 'clientOwner').get(()=> client);
//         const record_from_id = sandbox.stub(Models, 'getRecordFromId').returns(cut);
//
//         const actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record: deliverable, event});
//         const event_data = {cut_id: cut_id, initiator: initiator, event};
//         try {
//           await execute({event_data, record: deliverable, actions});
//           expect(post_msg_spy.called).to.be.true;
//           expect(msg_content_spy.called).to.be.true;
//           done();
//         } catch (e) {
//           done(e);
//         }
//       });
//     });
//
//     describe('deliverable kickoff', function() {
//       beforeEach(function () {
//         const something = 'SOMETHING';
//       });
//       afterEach(function () {
//         sandbox.restore();
//       });
//       it('should call mailer send on execute', async function(done) {
//         const cut_id = 'cut_id';
//         const deliverable_id = 'deliverable_id';
//         const initiator = 'initiator_id';
//         const event = EVENTS.deliverable_kickoff;
//         const cut = new Cut({_id: cut_id});
//         const deliverable = new Deliverable({_id: deliverable_id});
//
//         const retrieve_spy = sandbox.spy(Mailer.prototype, 'getSubstitutionData');
//         const send_spy = sandbox.spy(Mailer.prototype, 'send');
//         const deep_send_spy = sandbox.spy(Mailer.prototype, '_send');
//
//         const collaborator = new Collaborator({email: Meteor.settings.public.test_email});
//         const client = new Client({email: Meteor.settings.public.test_email});
//         const get_deliverable_stub = sandbox.stub(cut, 'deliverable').get(()=> deliverable);
//         const display_name_stub = sandbox.stub(deliverable, 'displayName').get(()=> 'Test Deliverable Display Name');
//         const collaborator_name = sandbox.stub(collaborator, 'displayName').get(()=> 'Test PostPo Owner Display Name');
//         const client_name = sandbox.stub(client, 'displayName').get(()=> 'Test Client Owner Display Name');
//         const postpoOwnerStub = sandbox.stub(deliverable, 'postpoOwner').get(()=> collaborator);
//         const clientOwnerStub = sandbox.stub(deliverable, 'clientOwner').get(()=> client);
//
//         const actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record: deliverable, event});
//         const event_data = {deliverable_id: deliverable_id, initiator: initiator, event};
//         try {
//           await execute({event_data, record: deliverable, actions});
//           expect(send_spy.called).to.be.true;
//           expect(deep_send_spy.called).to.be.true;
//           expect(retrieve_spy.called).to.be.true;
//           done();
//         } catch (e) {
//           done(e);
//         }
//       });
//
//       it('should call slack notify on execute', async function(done) {
//         const cut_id = 'cut_id';
//         const deliverable_id = 'deliverable_id';
//         const initiator = 'initiator_id';
//         const event = EVENTS.deliverable_kickoff;
//         const cut = new Cut({_id: cut_id});
//         const deliverable = new Deliverable({_id: deliverable_id});
//
//         const post_msg_spy = sandbox.spy(Slack, 'postMessage');
//         const msg_content_spy = sandbox.spy(Slack, 'getMessageContent');
//
//         const collaborator = new Collaborator({email: Meteor.settings.public.test_email});
//         const client = new Client({email: Meteor.settings.public.test_email});
//         const get_deliverable_stub = sandbox.stub(cut, 'deliverable').get(()=> deliverable);
//         const display_name_stub = sandbox.stub(deliverable, 'displayName').get(()=> 'Test Deliverable Display Name');
//         const collaborator_name = sandbox.stub(collaborator, 'displayName').get(()=> 'Test PostPo Owner Display Name');
//         const client_name = sandbox.stub(client, 'displayName').get(()=> 'Test Client Owner Display Name');
//         const postpoOwnerStub = sandbox.stub(deliverable, 'postpoOwner').get(()=> collaborator);
//         const clientOwnerStub = sandbox.stub(deliverable, 'clientOwner').get(()=> client);
//         const record_from_id = sandbox.stub(Models, 'getRecordFromId').returns(deliverable);
//
//         const actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record: deliverable, event});
//         const event_data = {deliverable_id: deliverable_id, initiator: initiator, event};
//         try {
//           await execute({event_data, record: deliverable, actions});
//           expect(post_msg_spy.called).to.be.true;
//           expect(msg_content_spy.called).to.be.true;
//           done();
//         } catch (e) {
//           done(e);
//         }
//       });
//     });
//
//     describe('cut verified', function() {
//       afterEach(function () {
//         sandbox.restore();
//       });
//
//       it('should call mailer send on execute', async function(done) {
//         const cut_id = 'cut_id';
//         const deliverable_id = 'deliverable_id';
//         const initiator = 'initiator_id';
//         const event = EVENTS.has_been_sent_to_client;
//         const cut = new Cut({_id: cut_id});
//         const deliverable = new Deliverable({_id: deliverable_id});
//
//         const retrieve_spy = sandbox.spy(Mailer.prototype, 'getSubstitutionData');
//         const send_spy = sandbox.spy(Mailer.prototype, 'send');
//         const deep_send_spy = sandbox.spy(Mailer.prototype, '_send');
//
//         const collaborator = new Collaborator({email: Meteor.settings.public.test_email});
//         const client = new Client({email: Meteor.settings.public.test_email});
//         const get_deliverable_stub = sandbox.stub(cut, 'deliverable').get(()=> deliverable);
//         const display_name_stub = sandbox.stub(deliverable, 'displayName').get(()=> 'Test Deliverable Display Name');
//         const collaborator_name = sandbox.stub(collaborator, 'displayName').get(()=> 'Test PostPo Owner Display Name');
//         const client_name = sandbox.stub(client, 'displayName').get(()=> 'Test Client Owner Display Name');
//         const postpoOwnerStub = sandbox.stub(deliverable, 'postpoOwner').get(()=> collaborator);
//         const clientOwnerStub = sandbox.stub(deliverable, 'clientOwner').get(()=> client);
//
//         const actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record: deliverable, event});
//         const event_data = {cut_id: cut_id, initiator: initiator, event};
//         try {
//           await execute({event_data, record: deliverable, actions});
//           expect(send_spy.called).to.be.true;
//           expect(deep_send_spy.called).to.be.true;
//           expect(retrieve_spy.called).to.be.true;
//           done();
//         } catch (e) {
//           done(e);
//         }
//       });
//
//       it('should call slack notify on execute', async function(done) {
//         const cut_id = 'cut_id';
//         const deliverable_id = 'deliverable_id';
//         const initiator = 'initiator_id';
//         const event = EVENTS.has_been_sent_to_client;
//         const cut = new Cut({_id: cut_id});
//         const deliverable = new Deliverable({_id: deliverable_id});
//
//         const post_msg_spy = sandbox.spy(Slack, 'postMessage');
//         const msg_content_spy = sandbox.spy(Slack, 'getMessageContent');
//
//         const collaborator = new Collaborator({email: Meteor.settings.public.test_email});
//         const client = new Client({email: Meteor.settings.public.test_email});
//         const get_deliverable_stub = sandbox.stub(cut, 'deliverable').get(()=> deliverable);
//         const display_name_stub = sandbox.stub(deliverable, 'displayName').get(()=> 'Test Deliverable Display Name');
//         const collaborator_name = sandbox.stub(collaborator, 'displayName').get(()=> 'Test PostPo Owner Display Name');
//         const client_name = sandbox.stub(client, 'displayName').get(()=> 'Test Client Owner Display Name');
//         const postpoOwnerStub = sandbox.stub(deliverable, 'postpoOwner').get(()=> collaborator);
//         const clientOwnerStub = sandbox.stub(deliverable, 'clientOwner').get(()=> client);
//         const record_from_id = sandbox.stub(Models, 'getRecordFromId').returns(cut);
//
//         const actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record: deliverable, event});
//         const event_data = {cut_id: cut_id, initiator: initiator, event};
//         try {
//           await execute({event_data, record: deliverable, actions});
//           expect(post_msg_spy.called).to.be.true;
//           expect(msg_content_spy.called).to.be.true;
//           done();
//         } catch (e) {
//           done(e);
//         }
//       });
//     });
//
//     describe('deliverable wrapped', function() {
//       afterEach(function () {
//         sandbox.restore();
//       });
//
//       it('should call mailer send on execute', async function(done) {
//         const cut_id = 'cut_id';
//         const deliverable_id = 'deliverable_id';
//         const initiator = 'initiator_id';
//         const event = EVENTS.deliverable_wrapped;
//         const cut = new Cut({_id: cut_id});
//         const deliverable = new Deliverable({_id: deliverable_id});
//
//         const retrieve_spy = sandbox.spy(Mailer.prototype, 'getSubstitutionData');
//         const send_spy = sandbox.spy(Mailer.prototype, 'send');
//         const deep_send_spy = sandbox.spy(Mailer.prototype, '_send');
//
//         const collaborator = new Collaborator({email: Meteor.settings.public.test_email});
//         const client = new Client({email: Meteor.settings.public.test_email});
//         const get_deliverable_stub = sandbox.stub(cut, 'deliverable').get(()=> deliverable);
//         const display_name_stub = sandbox.stub(deliverable, 'displayName').get(()=> 'Test Deliverable Display Name');
//         const collaborator_name = sandbox.stub(collaborator, 'displayName').get(()=> 'Test PostPo Owner Display Name');
//         const client_name = sandbox.stub(client, 'displayName').get(()=> 'Test Client Owner Display Name');
//         const postpoOwnerStub = sandbox.stub(deliverable, 'postpoOwner').get(()=> collaborator);
//         const clientOwnerStub = sandbox.stub(deliverable, 'clientOwner').get(()=> client);
//
//         const actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record: deliverable, event});
//         const event_data = {deliverable_id: deliverable_id, initiator: initiator, event};
//         try {
//           await execute({event_data, record: deliverable, actions});
//           expect(send_spy.called).to.be.true;
//           expect(deep_send_spy.called).to.be.true;
//           expect(retrieve_spy.called).to.be.true;
//           done();
//         } catch (e) {
//           done(e);
//         }
//       });
//
//       it('should call slack notify on execute', async function(done) {
//         const cut_id = 'cut_id';
//         const deliverable_id = 'deliverable_id';
//         const initiator = 'initiator_id';
//         const event = EVENTS.deliverable_wrapped;
//         const cut = new Cut({_id: cut_id});
//         const deliverable = new Deliverable({_id: deliverable_id});
//
//         const post_msg_spy = sandbox.spy(Slack, 'postMessage');
//         const msg_content_spy = sandbox.spy(Slack, 'getMessageContent');
//
//         const collaborator = new Collaborator({email: Meteor.settings.public.test_email});
//         const client = new Client({email: Meteor.settings.public.test_email});
//         const get_deliverable_stub = sandbox.stub(cut, 'deliverable').get(()=> deliverable);
//         const display_name_stub = sandbox.stub(deliverable, 'displayName').get(()=> 'Test Deliverable Display Name');
//         const collaborator_name = sandbox.stub(collaborator, 'displayName').get(()=> 'Test PostPo Owner Display Name');
//         const client_name = sandbox.stub(client, 'displayName').get(()=> 'Test Client Owner Display Name');
//         const postpoOwnerStub = sandbox.stub(deliverable, 'postpoOwner').get(()=> collaborator);
//         const clientOwnerStub = sandbox.stub(deliverable, 'clientOwner').get(()=> client);
//         const record_from_id = sandbox.stub(Models, 'getRecordFromId').returns(cut);
//
//         const actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record: deliverable, event});
//         const event_data = {deliverable_id: deliverable_id, initiator: initiator, event};
//         try {
//           await execute({event_data, record: deliverable, actions});
//           expect(post_msg_spy.called).to.be.true;
//           expect(msg_content_spy.called).to.be.true;
//           done();
//         } catch (e) {
//           done(e);
//         }
//       });
//     });
//
//     describe('deliverable wrapped', function() {
//       afterEach(function () {
//         sandbox.restore();
//       });
//
//       it('should call mailer send on execute', async function(done) {
//         const cut_id = 'cut_id';
//         const deliverable_id = 'deliverable_id';
//         const initiator = 'initiator_id';
//         const event = EVENTS.deliverable_wrapped;
//         const cut = new Cut({_id: cut_id});
//         const deliverable = new Deliverable({_id: deliverable_id});
//
//         const retrieve_spy = sandbox.spy(Mailer.prototype, 'getSubstitutionData');
//         const send_spy = sandbox.spy(Mailer.prototype, 'send');
//         const deep_send_spy = sandbox.spy(Mailer.prototype, '_send');
//
//         const collaborator = new Collaborator({email: Meteor.settings.public.test_email});
//         const client = new Client({email: Meteor.settings.public.test_email});
//         const get_deliverable_stub = sandbox.stub(cut, 'deliverable').get(()=> deliverable);
//         const display_name_stub = sandbox.stub(deliverable, 'displayName').get(()=> 'Test Deliverable Display Name');
//         const collaborator_name = sandbox.stub(collaborator, 'displayName').get(()=> 'Test PostPo Owner Display Name');
//         const client_name = sandbox.stub(client, 'displayName').get(()=> 'Test Client Owner Display Name');
//         const postpoOwnerStub = sandbox.stub(deliverable, 'postpoOwner').get(()=> collaborator);
//         const clientOwnerStub = sandbox.stub(deliverable, 'clientOwner').get(()=> client);
//
//         const actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record: deliverable, event});
//         const event_data = {deliverable_id: deliverable_id, initiator: initiator, event};
//         try {
//           await execute({event_data, record: deliverable, actions});
//           expect(send_spy.called).to.be.true;
//           expect(deep_send_spy.called).to.be.true;
//           expect(retrieve_spy.called).to.be.true;
//           done();
//         } catch (e) {
//           done(e);
//         }
//       });
//
//       it('should call slack notify on execute', async function(done) {
//         const cut_id = 'cut_id';
//         const deliverable_id = 'deliverable_id';
//         const initiator = 'initiator_id';
//         const event = EVENTS.deliverable_wrapped;
//         const cut = new Cut({_id: cut_id});
//         const deliverable = new Deliverable({_id: deliverable_id});
//
//         const post_msg_spy = sandbox.spy(Slack, 'postMessage');
//         const msg_content_spy = sandbox.spy(Slack, 'getMessageContent');
//
//         const collaborator = new Collaborator({email: Meteor.settings.public.test_email});
//         const client = new Client({email: Meteor.settings.public.test_email});
//         const get_deliverable_stub = sandbox.stub(cut, 'deliverable').get(()=> deliverable);
//         const display_name_stub = sandbox.stub(deliverable, 'displayName').get(()=> 'Test Deliverable Display Name');
//         const collaborator_name = sandbox.stub(collaborator, 'displayName').get(()=> 'Test PostPo Owner Display Name');
//         const client_name = sandbox.stub(client, 'displayName').get(()=> 'Test Client Owner Display Name');
//         const postpoOwnerStub = sandbox.stub(deliverable, 'postpoOwner').get(()=> collaborator);
//         const clientOwnerStub = sandbox.stub(deliverable, 'clientOwner').get(()=> client);
//         const record_from_id = sandbox.stub(Models, 'getRecordFromId').returns(cut);
//
//         const actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record: deliverable, event});
//         const event_data = {deliverable_id: deliverable_id, initiator: initiator, event};
//         try {
//           await execute({event_data, record: deliverable, actions});
//           expect(post_msg_spy.called).to.be.true;
//           expect(msg_content_spy.called).to.be.true;
//           done();
//         } catch (e) {
//           done(e);
//         }
//       });
//     });
//
//     describe('cut approved by client', function() {
//       afterEach(function () {
//         sandbox.restore();
//       });
//
//       it('should call mailer send on execute', async function(done) {
//         const cut_id = 'cut_id';
//         const deliverable_id = 'deliverable_id';
//         const initiator = 'initiator_id';
//         const event = EVENTS.cut_approved_by_client;
//         const cut = new Cut({_id: cut_id});
//         const deliverable = new Deliverable({_id: deliverable_id});
//
//         const retrieve_spy = sandbox.spy(Mailer.prototype, 'getSubstitutionData');
//         const send_spy = sandbox.spy(Mailer.prototype, 'send');
//         const deep_send_spy = sandbox.spy(Mailer.prototype, '_send');
//
//         const collaborator = new Collaborator({email: Meteor.settings.public.test_email});
//         const client = new Client({email: Meteor.settings.public.test_email});
//         const get_deliverable_stub = sandbox.stub(cut, 'deliverable').get(()=> deliverable);
//         const display_name_stub = sandbox.stub(deliverable, 'displayName').get(()=> 'Test Deliverable Display Name');
//         const collaborator_name = sandbox.stub(collaborator, 'displayName').get(()=> 'Test PostPo Owner Display Name');
//         const client_name = sandbox.stub(client, 'displayName').get(()=> 'Test Client Owner Display Name');
//         const postpoOwnerStub = sandbox.stub(deliverable, 'postpoOwner').get(()=> collaborator);
//         const clientOwnerStub = sandbox.stub(deliverable, 'clientOwner').get(()=> client);
//
//         const actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record: deliverable, event});
//         const event_data = {cut_id, initiator: initiator, event};
//         try {
//           await execute({event_data, record: deliverable, actions});
//           expect(send_spy.called).to.be.true;
//           expect(deep_send_spy.called).to.be.true;
//           expect(retrieve_spy.called).to.be.true;
//           done();
//         } catch (e) {
//           done(e);
//         }
//       });
//
//       it('should call slack notify on execute', async function(done) {
//         const cut_id = 'cut_id';
//         const deliverable_id = 'deliverable_id';
//         const initiator = 'initiator_id';
//         const event = EVENTS.cut_approved_by_client;
//         const cut = new Cut({_id: cut_id});
//         const deliverable = new Deliverable({_id: deliverable_id});
//
//         const post_msg_spy = sandbox.spy(Slack, 'postMessage');
//         const msg_content_spy = sandbox.spy(Slack, 'getMessageContent');
//
//         const collaborator = new Collaborator({email: Meteor.settings.public.test_email});
//         const client = new Client({email: Meteor.settings.public.test_email});
//         const get_deliverable_stub = sandbox.stub(cut, 'deliverable').get(()=> deliverable);
//         const display_name_stub = sandbox.stub(deliverable, 'displayName').get(()=> 'Test Deliverable Display Name');
//         const collaborator_name = sandbox.stub(collaborator, 'displayName').get(()=> 'Test PostPo Owner Display Name');
//         const client_name = sandbox.stub(client, 'displayName').get(()=> 'Test Client Owner Display Name');
//         const postpoOwnerStub = sandbox.stub(deliverable, 'postpoOwner').get(()=> collaborator);
//         const clientOwnerStub = sandbox.stub(deliverable, 'clientOwner').get(()=> client);
//         const record_from_id = sandbox.stub(Models, 'getRecordFromId').returns(cut);
//
//         const actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record: deliverable, event});
//         const event_data = {cut_id, initiator: initiator, event};
//         try {
//           await execute({event_data, record: deliverable, actions});
//           expect(post_msg_spy.called).to.be.true;
//           expect(msg_content_spy.called).to.be.true;
//           done();
//         } catch (e) {
//           done(e);
//         }
//       });
//     });
//
//     describe('revisions verified', function() {
//       afterEach(function () {
//         sandbox.restore();
//       });
//
//       it('should call mailer send on execute', async function(done) {
//         const cut_id = 'cut_id';
//         const deliverable_id = 'deliverable_id';
//         const initiator = 'initiator_id';
//         const event = EVENTS.revisions_sent;
//         const cut = new Cut({_id: cut_id});
//         const deliverable = new Deliverable({_id: deliverable_id});
//
//         const retrieve_spy = sandbox.spy(Mailer.prototype, 'getSubstitutionData');
//         const send_spy = sandbox.spy(Mailer.prototype, 'send');
//         const deep_send_spy = sandbox.spy(Mailer.prototype, '_send');
//
//         const collaborator = new Collaborator({email: Meteor.settings.public.test_email});
//         const client = new Client({email: Meteor.settings.public.test_email});
//         const get_deliverable_stub = sandbox.stub(cut, 'deliverable').get(()=> deliverable);
//         const display_name_stub = sandbox.stub(deliverable, 'displayName').get(()=> '(Deliverable Display Name)');
//         const collaborator_name = sandbox.stub(collaborator, 'displayName').get(()=> 'Test PostPo Owner Display Name');
//         const client_name = sandbox.stub(client, 'displayName').get(()=> 'Test Client Owner Display Name');
//         const postpoOwnerStub = sandbox.stub(deliverable, 'postpoOwner').get(()=> collaborator);
//         const clientOwnerStub = sandbox.stub(deliverable, 'clientOwner').get(()=> client);
//
//         const actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record: deliverable, event});
//         const event_data = {cut_id, initiator: initiator, event};
//         try {
//           await execute({event_data, record: deliverable, actions});
//           expect(send_spy.called).to.be.true;
//           expect(deep_send_spy.called).to.be.true;
//           expect(retrieve_spy.called).to.be.true;
//           done();
//         } catch (e) {
//           done(e);
//         }
//       });
//
//       it('should call slack notify on execute', async function(done) {
//         const cut_id = 'cut_id';
//         const deliverable_id = 'deliverable_id';
//         const initiator = 'initiator_id';
//         const event = EVENTS.revisions_sent;
//         const cut = new Cut({_id: cut_id});
//         const deliverable = new Deliverable({_id: deliverable_id});
//
//         const post_msg_spy = sandbox.spy(Slack, 'postMessage');
//         const msg_content_spy = sandbox.spy(Slack, 'getMessageContent');
//
//         const collaborator = new Collaborator({email: Meteor.settings.public.test_email});
//         const client = new Client({email: Meteor.settings.public.test_email});
//         const get_deliverable_stub = sandbox.stub(cut, 'deliverable').get(()=> deliverable);
//         const display_name_stub = sandbox.stub(deliverable, 'displayName').get(()=> 'Test Deliverable Display Name');
//         const collaborator_name = sandbox.stub(collaborator, 'displayName').get(()=> 'Test PostPo Owner Display Name');
//         const client_name = sandbox.stub(client, 'displayName').get(()=> 'Test Client Owner Display Name');
//         const postpoOwnerStub = sandbox.stub(deliverable, 'postpoOwner').get(()=> collaborator);
//         const clientOwnerStub = sandbox.stub(deliverable, 'clientOwner').get(()=> client);
//         const record_from_id = sandbox.stub(Models, 'getRecordFromId').returns(cut);
//
//         const actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record: deliverable, event});
//         const event_data = {cut_id, initiator: initiator, event};
//         try {
//           await execute({event_data, record: deliverable, actions});
//           expect(post_msg_spy.called).to.be.true;
//           expect(msg_content_spy.called).to.be.true;
//           done();
//         } catch (e) {
//           done(e);
//         }
//       });
//     });
//
//   });
// });
"use strict";