"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _practicalmeteorChai = _interopRequireDefault(require("meteor/practicalmeteor:chai"));

var _mdgValidatedMethod = _interopRequireDefault(require("meteor/mdg:validated-method"));

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _deliverable = _interopRequireDefault(require("../deliverable"));

var should = _practicalmeteorChai.default.should(); // describe('deliverable immutable', function() {
//   describe('constructor', function() {
//     it('should initialize without error', function() {
//       const d = new Deliverable({});
//     });
//     it('should initialize with correct values if non-empty', function() {
//       const d = new Deliverable({stage: 'PREPRO'});
//       expect(d.get('stage')).to.equal('PREPRO');
//     });
//   });
//   describe('getters/setters', function() {
//     it('should be able to set stage', function() {
//       let d = new Deliverable({});
//       d = d.set('stage', 'PREPRO');
//       expect(d.get('stage')).to.equal('PREPRO');
//       expect(d.stage).to.equal('PREPRO');
//     });
//   });
//   describe('#save()', function() {
//     it('should error on save when deliverable does not match schema', function() {
//       const d = new Deliverable({});
//       (function(){
//         try {
//           d.save()
//         } catch (err){ throw new Error(); }
//       }).should.Throw(Error);
//     });
//     it('should save without error', function() {
//       const d = new Deliverable({stage: 'PREPRO'});
//       (function(){ d.save() }).should.not.Throw(Error);
//     });
//   });
// });