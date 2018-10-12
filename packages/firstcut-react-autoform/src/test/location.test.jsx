
jest.mock('semantic-ui-react');

import React from 'react';
import { shallow } from 'enzyme';
import { Button } from 'semantic-ui-react';
import renderer from 'react-test-renderer';
import LocationField from '../components/location';

describe('<LocationField />', () => {
  const onChange = jest.fn();
  const locationDisplayName = 'Location Display Name';
  const fieldName = 'Field Name';
  const testRecord = { locationDisplayName };
  const locationComponent = (
    <LocationField
      record={testRecord}
      name={fieldName}
      onChange={onChange}
    />
  );

  const wrapper = shallow(locationComponent);

  test('should contain a clear location button', () => {
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  test('should call onChange with a value of null on clear location', () => {
    wrapper.find(Button).simulate('click');
    expect(onChange).toHaveBeenCalledWith(null, { name: fieldName, value: {} });
  });

  test('should match snapshots', () => {
    const component = renderer.create(locationComponent);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
