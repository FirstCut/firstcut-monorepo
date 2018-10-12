"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _semanticUiReact = require("semantic-ui-react");

var _reactTestRenderer = _interopRequireDefault(require("react-test-renderer"));

var _location = _interopRequireDefault(require("../components/location"));

jest.mock('semantic-ui-react');
describe('<LocationField />', function () {
  var onChange = jest.fn();
  var locationDisplayName = 'Location Display Name';
  var fieldName = 'Field Name';
  var testRecord = {
    locationDisplayName: locationDisplayName
  };

  var locationComponent = _react.default.createElement(_location.default, {
    record: testRecord,
    name: fieldName,
    onChange: onChange
  });

  var wrapper = (0, _enzyme.shallow)(locationComponent);
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
  test('should match snapshots', function () {
    var component = _reactTestRenderer.default.create(locationComponent);

    var tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});