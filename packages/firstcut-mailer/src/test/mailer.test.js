//
// import { Meteor } from 'meteor/meteor';
// import Mailer from '../mailer';
// import { insertTestData, restoreTestData, TEST_DELIVERABLE, POSTPO_OWNER_ID, PROJECT_ID, CLIENT_OWNER_ID_FOR_DELIVERABLE } from '/imports/api/testing-utils';
// import { stubUser } from '/imports/api/testing-utils';
// import { MeteorStubs } from 'meteor/velocity:meteor-stubs';
// import { TEMPLATES, substitution_data_generators } from '../mailer.enum';
// import { Record } from 'immutable';
// import sinon from 'sinon';
//
// const mailer = new Mailer();
//
// describe('mailer', function() {
//   before(function() {
//     MeteorStubs.install();
//     stubUser();
//     insertTestData();
//   });
//
//   after(function() {
//     MeteorStubs.uninstall();
//     // restoreTestData();
//   });
//
//   describe('getSubstitutionData', function() {
//     it('should have a generator function defined for each template', function() {
//       const generator_keys = Object.keys(substitution_data_generators);
//       const templates = Object.values(TEMPLATES);
//       expect(generator_keys).to.include.all.members(templates);
//     });
//
//     it('should throw validation error when template_id not in TEMPLATES', function() {
//       const record = new Record({})();
//       const recipient = new Record({})();
//       const should_error = () => mailer.getSubstitutionData(record, recipient, 'not-in-templates');
//       expect(should_error).to.throw();
//     });
//
//     it('should return a json object for valid empty inputs', function() {
//       const record = new Record({})();
//       const recipient = new Record({})();
//       for (template of Object.values(TEMPLATES)) {
//         const result = mailer.getSubstitutionData(record, recipient, template);
//         expect(result).to.be.an('object');
//       }
//     });
//
//     it('should call the correct substitition data generator function and pass the record and recipient', function() {
//       const record = new Record({})();
//       const recipient = new Record({})();
//       for (template of Object.values(TEMPLATES)) {
//         let spy = sinon.spy(substitution_data_generators, template);
//         const result = mailer.getSubstitutionData(record, recipient, template);
//         expect(spy.called).to.be.true;
//         expect(spy.calledWith(record)).to.be.true;
//         expect(spy.calledWith(recipient)).to.be.true;
//       }
//     });
//   });
//
//   describe('send', function() {
//     it('should accept optional substitution data', async function(done) {
//       try {
//         let result = await mailer.send(Object.values(TEMPLATES)[0], [Meteor.settings.test_email], {name: "Lucy"});
//         done();
//       } catch (e) {
//         done(e);
//       }
//     });
//
//     it('should throw validation error when emails not correctly formatted email', async function(done) {
//       try {
//         let result = await mailer.send(Object.values(TEMPLATES)[0], ['l']);
//         done();
//       } catch (e) {
//         expect(e.error).to.equal('validation-error');
//         expect(e.details[0].name).to.equal('addresses.0');
//         expect(e.details).to.have.length(1);
//         done();
//       }
//     });
//
//     it('should throw validation error when template not in allowed templates', async function(done) {
//       try {
//         let result = await mailer.send('not-in-allowed-templates', [Meteor.settings.test_email]);
//         done();
//       } catch (e) {
//         expect(e.error).to.equal('validation-error');
//         expect(e.details[0].name).to.equal('template_id');
//         expect(e.details).to.have.length(1);
//         done();
//       }
//     });
//
//     it('should succeed with allowed template_id and properly formatted emails', async function(done) {
//       try {
//         const mock_mailer = sinon.mock(Mailer.prototype);
//         const expectation = mock_mailer.expects('_send').once();
//         let result = await mailer.send(Object.values(TEMPLATES)[0], [Meteor.settings.test_email]);
//         mock_mailer.verify();
//         mock_mailer.restore();
//         done();
//       } catch (e) {
//         done(e);
//       }
//     });
//   });
// });
