import chai from 'meteor/practicalmeteor:chai';
import ValidationError from 'meteor/mdg:validated-method';
import ClientError from 'simpl-schema';
import Deliverable from '../deliverable';

const should = chai.should();

// describe('deliverable immutable', function() {
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
