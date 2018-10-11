"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _semanticUiReact = require("semantic-ui-react");

var _location = _interopRequireDefault(require("../components/location"));

jest.mock('semantic-ui-react');
describe('<LocationField />', function () {
  var onChange = jest.fn();
  var locationDisplayName = 'Location Display Name';
  var fieldName = 'Field Name';
  var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_location.default, {
    record: {
      locationDisplayName: locationDisplayName,
      location: ''
    },
    name: fieldName,
    onChange: onChange
  }));
  test('should contain a clear location button', function () {
    expect(wrapper.find(_semanticUiReact.Button)).toHaveLength(1);
  });
  test('should call onChange with a value of null on clear location', function () {
    wrapper.find(_semanticUiReact.Button).simulate('click');
    expect(onChange).toHaveBeenCalledWith(null, {
      name: fieldName,
      value: {}
    });
  });
});