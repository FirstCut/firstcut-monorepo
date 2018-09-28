
// import Deliverable from '../deliverable.immutable';
// import Project from '../project.immutable';
// import Player from '../player.immutable';

// const immutables = [
//   Deliverable
// ];

// describe('all database interface immutables', function() {
//   describe('constructor', function() {
//     it('should initialize without error', function() {
//       immutables.forEach((cls)=> {
//         (function(){ return new cls()}).should.not.Throw(Error);
//       });
//     });
//     it('should have email method', function() {
//       immutables.forEach((cls)=>{
//         expect(new cls().email).to.not.be.a('undefined');
//       });
//     });
//     it('should define a schema', function() {
//       immutables.forEach((cls)=>{
//         expect(cls.schema).to.not.be.a('undefined');
//       });
//     });
//     it('should define a collection name', function() {
//       immutables.forEach((cls)=>{
//         expect(cls.collectionName).to.not.be.a('undefined');
//       });
//     });
//     it('should have upsert defined on the class', function() {
//       immutables.forEach((cls)=>{
//         expect(cls.upsert).to.not.be.a('undefined');
//       });
//     });
//   });
// });
