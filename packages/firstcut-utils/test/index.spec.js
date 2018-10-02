
jest.mock('firstcut-meteor');
jest.mock('firstcut-filestore');
jest.mock('firstcut-players');
import { pluralize } from '../src/index.js';

test('should pluralize by appending s in correct cases', () => {
  expect(pluralize('project')).toBe('projects');
  expect(pluralize('card')).toBe('cards');
  expect(pluralize('care')).toBe('cares');
  expect(pluralize('company')).not.toBe('companys');
});
test('should pluralize by changing y to ies in correct cases', () => {
  expect(pluralize('company')).toBe('companies');
  expect(pluralize('sky')).toBe('skies');
});
