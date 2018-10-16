
jest.mock('/imports/api/models');
jest.mock('meteor/meteor');
jest.mock('meteor/mongo');
jest.mock('meteor/http');
jest.mock('meteor/universe:i18n');
jest.mock('meteor/mdg:validated-method');
jest.unmock('semantic-ui-react');

import renderer from 'react-test-renderer';
import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router';
import * as config from '../config';
import App from '../layouts/app';

config.getQualifiedSkills = jest.fn().mockReturnValue(['CLIENT']);

// configure({ adapter: new Adapter() });
test('tree should render for client', () => {
  const component = renderer.create(
    <App />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
