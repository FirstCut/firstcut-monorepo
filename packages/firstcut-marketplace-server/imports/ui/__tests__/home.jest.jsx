
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { _ } from 'lodash';
import { ExploreMarketplacePage } from '../pages';

describe('home page', () => {
  const wrapper = shallow(<ExploreMarketplacePage />);

  test('should match snapshot', () => {
    const component = renderer.create(
      <ExploreMarketplacePage />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
