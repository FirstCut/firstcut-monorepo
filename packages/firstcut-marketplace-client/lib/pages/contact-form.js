"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.GET_TEMPLATE_QUERY = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _firstcutUi = require("firstcut-ui");

var _reactApollo = require("react-apollo");

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

var _firstcutAnalytics = _interopRequireDefault(require("firstcut-analytics"));

var _loading = _interopRequireDefault(require("../components/loading"));

var _alert = _interopRequireDefault(require("../components/alert"));

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n  mutation addRequest(\n    $firstName: String!,\n    $lastName: String!,\n    $projectId: String!,\n    $email: String!,\n    $company: String,\n    $website: String,\n    $location: String,\n    $budget: String\n    $about: String\n  ) {\n    addRequest(\n      firstName: $firstName,\n      lastName: $lastName,\n      projectId: $projectId,\n      email: $email,\n      company: $company,\n      website: $website,\n      location: $location,\n      budget: $budget,\n      about: $about\n    ) {\n      _id\n    }\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n  query projectTemplate($projectId: ID!) {\n    projectTemplate(_id: $projectId) {\n      title\n      description\n      exampleUrl\n      _id\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

/**
 * ContactPage
 *
 * Displays a project template's information (description, title, example video)
 * along with a contact form.
 *
 * The contact form inserts a project request into the database via the graphql api
 * @param projectId { string } the id of the project template to display
 */
var GET_TEMPLATE_QUERY = (0, _graphqlTag.default)(_templateObject());
exports.GET_TEMPLATE_QUERY = GET_TEMPLATE_QUERY;

function ContactPage(props) {
  var projectId = props.projectId;
  return _react.default.createElement(_reactApollo.Query, {
    query: GET_TEMPLATE_QUERY,
    variables: {
      projectId: projectId
    }
  }, function (_ref) {
    var loading = _ref.loading,
        error = _ref.error,
        data = _ref.data;
    if (loading) return _react.default.createElement(_loading.default, null);
    if (error) return _react.default.createElement(_alert.default, {
      message: error.message
    });
    return _react.default.createElement(ContactFormPage, data.projectTemplate);
  });
}

var ADD_REQUEST = (0, _graphqlTag.default)(_templateObject2());

function ContactFormPage(props) {
  return _react.default.createElement(_reactApollo.Mutation, {
    mutation: ADD_REQUEST
  }, function (addRequest, mutationState) {
    return _react.default.createElement(ContactFormPageComponent, (0, _extends2.default)({
      mutationState: mutationState,
      addRequest: addRequest
    }, props));
  });
}

var ContactFormPageComponent =
/*#__PURE__*/
function (_React$PureComponent) {
  (0, _inherits2.default)(ContactFormPageComponent, _React$PureComponent);

  function ContactFormPageComponent(props) {
    var _this;

    (0, _classCallCheck2.default)(this, ContactFormPageComponent);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ContactFormPageComponent).call(this, props));
    _this.initialState = {
      confirm: false,
      error: null,
      website: '',
      company: '',
      firstName: '',
      lastName: '',
      budget: '',
      location: '',
      email: '',
      about: ''
    };

    _this.restoreState = function () {
      return _this.setState(_this.initialState);
    };

    _this.handleChange = function (e, _ref2) {
      var name = _ref2.name,
          value = _ref2.value;
      return _this.setState((0, _defineProperty2.default)({}, name, value));
    };

    _this.handleSubmit = function () {
      var _this$props = _this.props,
          addRequest = _this$props.addRequest,
          title = _this$props.title,
          _id = _this$props._id;
      var _this$state = _this.state,
          confirm = _this$state.confirm,
          error = _this$state.error,
          request = (0, _objectWithoutProperties2.default)(_this$state, ["confirm", "error"]);
      addRequest({
        variables: (0, _objectSpread2.default)({}, request, {
          projectId: _id
        })
      });

      _firstcutAnalytics.default.trackFormSubmission((0, _objectSpread2.default)({
        name: 'CONTACT_FORM',
        projectId: _id,
        projectTitle: title
      }, request));

      _this.setState({
        confirm: true
      });
    };

    _this.state = _this.initialState;
    return _this;
  }

  (0, _createClass2.default)(ContactFormPageComponent, [{
    key: "render",
    value: function render() {
      var _this$state2 = this.state,
          confirm = _this$state2.confirm,
          error = _this$state2.error,
          fields = (0, _objectWithoutProperties2.default)(_this$state2, ["confirm", "error"]);
      var mutationState = this.props.mutationState;
      var columnStyle = {
        paddingTop: '100px'
      };
      return _react.default.createElement("div", {
        style: {
          height: '100%'
        }
      }, mutationState.error && _react.default.createElement(_alert.default, {
        visible: mutationState.error,
        type: "error",
        message: mutationState.error.message
      }), _react.default.createElement(ConfirmationModal, {
        open: confirm,
        onClick: this.restoreState,
        onConfirm: this.restoreState
      }), _react.default.createElement(_firstcutUi.Grid, {
        stackable: true,
        style: {
          height: '100%'
        },
        reversed: "computer"
      }, _react.default.createElement(_firstcutUi.Grid.Column, {
        mobile: 16,
        tablet: 16,
        computer: 8,
        style: columnStyle,
        align: "center"
      }, _react.default.createElement(_firstcutUi.Responsive, {
        as: _firstcutUi.Container,
        maxWidth: 770,
        style: {
          height: '75px'
        }
      }), _react.default.createElement(ProjectDetails, this.props), _react.default.createElement(_firstcutUi.Responsive, {
        as: _firstcutUi.Image,
        minWidth: 1085,
        src: "/desktop.png",
        style: {
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          width: '100%',
          opacity: 0.1,
          zIndex: -1000
        }
      })), _react.default.createElement(_firstcutUi.Grid.Column, {
        style: columnStyle,
        align: "center",
        mobile: 16,
        tablet: 16,
        computer: 8
      }, _react.default.createElement(ContactForm, {
        fieldValues: fields,
        handleSubmit: this.handleSubmit,
        handleChange: this.handleChange
      }))));
    }
  }]);
  return ContactFormPageComponent;
}(_react.default.PureComponent);

function ContactForm(props) {
  var handleChange = props.handleChange,
      handleSubmit = props.handleSubmit,
      fieldValues = props.fieldValues;
  var firstName = fieldValues.firstName,
      lastName = fieldValues.lastName,
      website = fieldValues.website,
      company = fieldValues.company,
      email = fieldValues.email,
      budget = fieldValues.budget,
      location = fieldValues.location,
      about = fieldValues.about;
  return _react.default.createElement("div", {
    style: {
      maxWidth: '400px'
    }
  }, _react.default.createElement(_firstcutUi.Header, {
    color: "green",
    align: "left"
  }, "Contact us"), _react.default.createElement(_firstcutUi.Form, null, _react.default.createElement(_firstcutUi.Form.Group, {
    widths: "equal"
  }, _react.default.createElement(_firstcutUi.Form.Field, null, _react.default.createElement(_firstcutUi.Form.Input, {
    onChange: handleChange,
    placeholder: "First Name",
    name: "firstName",
    value: firstName,
    required: true
  })), _react.default.createElement(_firstcutUi.Form.Field, null, _react.default.createElement(_firstcutUi.Form.Input, {
    onChange: handleChange,
    placeholder: "Last Name",
    name: "lastName",
    value: lastName,
    required: true
  }))), _react.default.createElement(_firstcutUi.Form.Field, null, _react.default.createElement(_firstcutUi.Form.Input, {
    onChange: handleChange,
    placeholder: "Email",
    name: "email",
    value: email,
    required: true
  })), _react.default.createElement(_firstcutUi.Form.Field, null, _react.default.createElement(_firstcutUi.Form.Input, {
    onChange: handleChange,
    placeholder: "Company Name",
    name: "company",
    value: company,
    required: true
  })), _react.default.createElement(_firstcutUi.Form.Field, null, _react.default.createElement(_firstcutUi.Form.Input, {
    onChange: handleChange,
    placeholder: "Company Website",
    name: "website",
    value: website
  })), _react.default.createElement(_firstcutUi.Form.Field, null, _react.default.createElement(_firstcutUi.Form.Input, {
    onChange: handleChange,
    placeholder: "Where would you like to shoot your video?",
    name: "location",
    value: location
  })), _react.default.createElement(_firstcutUi.Form.Field, null, _react.default.createElement(_firstcutUi.Form.Input, {
    onChange: handleChange,
    placeholder: "What is your estimated budget range?",
    name: "budget",
    value: budget
  })), _react.default.createElement(_firstcutUi.Form.Field, null, _react.default.createElement(_firstcutUi.Form.TextArea, {
    onChange: handleChange,
    placeholder: "Anything about this project you would like us to know before we contact you?",
    name: "about",
    value: about
  })), _react.default.createElement(_firstcutUi.Form.Button, {
    fluid: true,
    color: "green",
    content: "SUBMIT",
    onClick: handleSubmit
  })));
}

function ConfirmationModal(props) {
  var open = props.open,
      onConfirm = props.onConfirm,
      onClick = props.onClick;
  return _react.default.createElement(_firstcutUi.Modal, {
    open: open,
    basic: true,
    size: "small",
    onClick: onClick
  }, _react.default.createElement(_firstcutUi.Header, {
    icon: "checkmark",
    content: "Thank you for your request"
  }), _react.default.createElement(_firstcutUi.Modal.Content, null, "We will be in touch soon!"), _react.default.createElement(_firstcutUi.Modal.Actions, null, _react.default.createElement(_firstcutUi.Button, {
    color: "green",
    inverted: true,
    onClick: onConfirm
  }, "CONFIRM")));
}

function ProjectDetails(props) {
  var title = props.title,
      description = props.description,
      exampleUrl = props.exampleUrl;
  return _react.default.createElement("div", {
    style: {
      maxWidth: '500px'
    }
  }, _react.default.createElement(_firstcutUi.Header, {
    color: "green",
    align: "left"
  }, title), _react.default.createElement(_firstcutUi.Embed, {
    url: exampleUrl,
    style: {
      marginBottom: '20px'
    }
  }), _react.default.createElement("i", null, description));
}

var _default = ContactPage;
exports.default = _default;