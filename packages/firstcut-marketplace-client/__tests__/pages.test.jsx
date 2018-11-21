
import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import App from '../src/App';
import {
  ContactPage,
  ExploreMarketplacePage,
  GET_PROJECT_TEMPLATES_QUERY,
  GET_TEMPLATE_QUERY
} from '../src/pages';
import Loading from '../src/components/loading';

jest.mock('firstcut-analytics');
jest.mock('react-router-dom');

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
      query: GET_PROJECT_TEMPLATES_QUERY,
    },
    result: {
      data: {
        projectTemplates: [testProject],
      },
    },
  },
  {
    request: {
      query: GET_TEMPLATE_QUERY,
      variables: {
        projectId: testProject._id,
      },
    },
    result: {
      data: {
        projectTemplate: testProject,
      },
    },
  },
];

describe('app', ()=>{
  test('renders loading state initially', () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <App />
      </MockedProvider>,
    );
    expect(wrapper.find(Loading)).toBeDefined();
  });

  test('should match snapshot after query load', async () => {
    const component = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <App />
      </MockedProvider>,
    );
    await wait(0);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('explore marketplace page', () => {
  test('should render loading state initially', () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ExploreMarketplacePage />
      </MockedProvider>,
    );
    expect(wrapper.find(Loading)).toBeDefined();
  });

  test('should match snapshot after query load', async () => {
    const component = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ExploreMarketplacePage />
      </MockedProvider>,
    );
    await wait(0);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
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
    await wait(0);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
