
import { pluralize } from '../utils';

describe('utils', () => {
  describe('pluralize', () => {
    it('should pluralize by appending s in correct cases', () => {
      expect(pluralize('project')).to.equal('projects');
      expect(pluralize('card')).to.equal('cards');
      expect(pluralize('care')).to.equal('cares');
      expect(pluralize('company')).to.not.equal('companys');
    });
    it('should pluralize by changing y to ies in correct cases', () => {
      expect(pluralize('company')).to.equal('companies');
      expect(pluralize('sky')).to.equal('skies');
    });
  });
});
