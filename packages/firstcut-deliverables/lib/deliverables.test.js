"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var Deliverable = _firstcutModels.default.Deliverable;
describe('deliverable model', function () {
  describe('schema', function () {
    it('should be able to set the blueprint', function () {
      var deliverable = Deliverable.createNew({});
      var blueprint = 'FULL_TESTIMONIAL';
      deliverable = deliverable.set('blueprint', blueprint);
      expect(deliverable.blueprint).to.equal(blueprint);
    });
  });
});