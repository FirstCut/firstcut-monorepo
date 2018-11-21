
import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from 'react-apollo/test-utils';
import Enzyme, { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import wait from 'waait';
import {
  ContactPage,
  GET_PROJECT_QUERY,
  ExploreMarketplacePage,
  GET_PROJECTS_QUERY,
} from '../src/pages';
import Loading from '../src/components/loading';

configure({ adapter: new Adapter() });

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
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ExploreMarketplacePage />
      </MockedProvider>,
    );
    expect(wrapper.find(Loading)).toBeDefined();
  });
});

describe('contact page', () => {
  test('should render loading state initially', () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ContactPage projectId={testProject._id} />
      </MockedProvider>,
    );
    expect(wrapper.find(Loading)).toBeDefined();
  });

  test('should match snapshot after query load', async () => {
    const component = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ContactPage projectId={testProject._id} />
      </MockedProvider>,
    );
    const tree = component.toJSON();
    await wait(0);
    expect(tree).toMatchSnapshot();
  });
});
