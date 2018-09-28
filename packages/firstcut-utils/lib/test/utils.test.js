"use strict";

var _utils = require("../utils");

describe('utils', function () {
  describe('pluralize', function () {
    it('should pluralize by appending s in correct cases', function () {
      expect((0, _utils.pluralize)('project')).to.equal('projects');
      expect((0, _utils.pluralize)('card')).to.equal('cards');
      expect((0, _utils.pluralize)('care')).to.equal('cares');
      expect((0, _utils.pluralize)('company')).to.not.equal('companys');
    });
    it('should pluralize by changing y to ies in correct cases', function () {
      expect((0, _utils.pluralize)('company')).to.equal('companies');
      expect((0, _utils.pluralize)('sky')).to.equal('skies');
    });
  });
});