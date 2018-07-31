
// import { SUPPORTED_EVENTS, ACTIONS } from '../shared/pipeline.enum.js';
// import Pipeline from '../pipeline.js';
// import { _ } from 'lodash';
// import { Record } from 'immutable';
// import sinon from 'sinon';
//
// const num_events = SUPPORTED_EVENTS.length;
// const events_1 = _.sampleSize(SUPPORTED_EVENTS, 2);
// const events_2 = _.sampleSize(SUPPORTED_EVENTS, 3);
// const events_3 = _.sampleSize(SUPPORTED_EVENTS, 2);
// const pipeline_1 = _.reduce(events_1, (result, event) => {
//   result = result.set(event, () => ['fake_action_1': {}]);
//   return result;
// }, new Map());
// const pipeline_2 = _.reduce(events_2, (result, event) => {
//   result = result.set(event, () => ['fake_action_1': {}, 'fake_action_2': {}]);
//   return result;
// }, new Map());
//
// let pipeline_3 = new Map();
// pipeline_3 = pipeline_3.set(SUPPORTED_EVENTS[0], () => ['fake_action_1': {}, 'fake_action_2': {}]);
//
// var sandbox = sinon.createSandbox({});
// describe('pipeline utils', function() {
//   describe('getActionsForEvent', function() {
//     afterEach(function () {
//       sandbox.restore();
//     });
//     it('should return correct actions for event with single action', function() {
//       const stub = sandbox.stub(Pipeline.prototype.constructor, 'getPipeline').returns(pipeline_1);
//       try {
//         let actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record: new Record({}), event: events_1[0]});
//         expect(actions).to.deep.equal(['fake_action_1']);
//       } catch (e) {
//         expect(e).to.be.equal(undefined);
//       }
//     });
//
//     it('should return correct actions for event with multiple actions', function() {
//       const stub = sandbox.stub(Pipeline.prototype.constructor, 'getPipeline').returns(pipeline_2);
//       let actions = Pipeline.getActionsForEvent({record_type: 'Deliverable', record: new Record({}), event: events_2[0]});
//       expect(actions).to.deep.equal(['fake_action_1', 'fake_action_2']);
//     });
//
//     it('should throw validation error when given unsupported event', function() {
//       try {
//         const stub = sandbox.stub(Pipeline.prototype.constructor, 'getPipeline').returns(pipeline_2);
//         Pipeline.getActionsForEvent({record_type: 'Deliverable', record: null, event: 'unsupported event'});
//       } catch (e) {
//         expect(ValidationError.is(e)).to.be.true;
//         expect(e.details).to.have.length(1);
//         expect(e.details[0].name).to.equal('event');
//       }
//     })
//
//     it('should return an empty array when pipeline does not include event', function() {
//       const pipeline = {[events_1[1]]: {actions: [{'fake': {}}]}};
//       const stub = sandbox.stub(Pipeline.prototype.constructor, 'getPipeline').returns(pipeline_3);
//       const result = Pipeline.getActionsForEvent({record_type: 'Deliverable', record: new Record({})(), event: SUPPORTED_EVENTS[1]});
//       expect(result).to.be.a('array');
//       expect(result).to.have.length(0);
//     });
//   });
// });
