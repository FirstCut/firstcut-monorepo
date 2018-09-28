
import Models from 'firstcut-models';

const {
  Deliverable,
} = Models;

describe('deliverable model', () => {
  describe('schema', () => {
    it('should be able to set the blueprint', () => {
      let deliverable = Deliverable.createNew({});
      const blueprint = 'FULL_TESTIMONIAL';
      deliverable = deliverable.set('blueprint', blueprint);
      expect(deliverable.blueprint).to.equal(blueprint);
    });
  });
});
