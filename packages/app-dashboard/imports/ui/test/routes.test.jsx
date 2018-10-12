import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import Routes from '../components/routing/routes';
import { routesForUser, getQualifiedSkills } from '../config';

jest.mock('meteor/meteor');
jest.mock('meteor/mongo');
jest.mock('meteor/http');
jest.mock('semantic-ui-react');
jest.mock(getQualifiedSkills, () => ['CLIENT']);

test('invalid path should redirect to 404', () => {
  console.log(getQualifiedSkills());
  const wrapper = mount(
    <MemoryRouter initialEntries={['/random']}>
      { routesForUser() }
    </MemoryRouter>,
  );
  // expect(wrapper.find(LandingPage)).toHaveLength(0);
  // expect(wrapper.find(NotFoundPage)).toHaveLength(1);
});

test('valid path should not redirect to 404', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );
  expect(wrapper.find(LandingPage)).toHaveLength(1);
  expect(wrapper.find(NotFoundPage)).toHaveLength(0);
});

test('does this run', () => {
  expect(true).toBe(false);
});
