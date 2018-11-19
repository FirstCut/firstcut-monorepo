
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import {
  Contact,
  GET_PROJECT_QUERY,
  ExploreMarketplacePage,
  GET_PROJECTS_QUERY,
} from '../pages';

const testProject = {
  _id: '1',
  title: 'Title',
  description: 'description',
  exampleThumb: 'http://example.thumb.com',
  exampleUrl: 'http://example.url.com',
};

const mocks = [
  {
    request: {
      query: GET_PROJECTS_QUERY,
    },
    result: {
      data: {
        projects: [testProject],
      },
    },
  },
  {
    request: {
      query: GET_PROJECT_QUERY,
      variables: {
        projectId: testProject._id,
      },
    },
    result: {
      data: {
        project: testProject,
      },
    },
  },
];

describe('explore marketplace page', () => {
  test('should render loading state initially', () => {
    const component = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ExploreMarketplacePage />
      </MockedProvider>,
    );
    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });
});

describe('contact page', () => {
  test('should render loading state initially', () => {
    const component = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Contact projectId={testProject._id} />
      </MockedProvider>,
    );
    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  test('should match snapshot after query load', async () => {
    const component = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Contact projectId={testProject._id} />
      </MockedProvider>,
    );
    const tree = component.toJSON();
    await wait(0);
    expect(tree).toMatchSnapshot();
  });
});
