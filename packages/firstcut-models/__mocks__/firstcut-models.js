
import { _ } from 'lodash';

const rest = jest.genMockFromModule('firstcut-models');
const Models = rest.default;
const { initModels } = rest;

_.forEach(Models, (m) => {
  m.fromId = jest.fn();
});

export { initModels };
export default Models;
