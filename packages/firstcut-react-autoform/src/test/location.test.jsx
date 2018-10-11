
jest.mock('semantic-ui-react');

import React from 'react';
import { shallow } from 'enzyme';
import { Button } from 'semantic-ui-react';
import LocationField from '../components/location';

describe('<LocationField />', () => {
  const onChange = jest.fn();
  const locationDisplayName = 'Location Display Name';
  const fieldName = 'Field Name';
  const wrapper = shallow(
    <LocationField
      record={{ locationDisplayName, location: '' }}
      name={fieldName}
      onChange={onChange}
    />,
  );
  test('should contain a clear location button', () => {
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  test('should call onChange with a value of null on clear location', () => {
    wrapper.find(Button).simulate('click');
    expect(onChange).toHaveBeenCalledWith(null, { name: fieldName, value: {} });
  });
});
