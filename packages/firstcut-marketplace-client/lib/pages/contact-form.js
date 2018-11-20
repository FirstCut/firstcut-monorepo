"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _firstcutUi = require("firstcut-ui");

var _reactApollo = require("react-apollo");

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

var _firstcutAnalytics = _interopRequireDefault(require("firstcut-analytics"));

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n      {\n        projectTemplate(_id: \"", "\") {\n          title\n          description\n          exampleUrl\n          _id\n        }\n      }\n    "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n  mutation addRequest(\n    $firstName: String!,\n    $lastName: String!,\n    $email: String!,\n    $company: String,\n    $website: String,\n    $location: String,\n    $budget: String\n    $about: String\n  ) {\n    addRequest(\n      firstName: $firstName,\n      lastName: $lastName,\n      email: $email,\n      company: $company,\n      website: $website,\n      location: $location,\n      budget: $budget,\n      about: $about\n    ) {\n      _id\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var addRequestMutation = (0, _graphqlTag.default)(_templateObject());

function Contact(props) {
  var projectId = props.projectId;
  return _react.default.createElement(_reactApollo.Query, {
    query: (0, _graphqlTag.default)(_templateObject2(), projectId)
  }, function (_ref) {
    var loading = _ref.loading,
        error = _ref.error,
        data = _ref.data;
    if (loading) return _react.default.createElement("p", null, "Loading...");
    if (error) return _react.default.createElement("p", null, "Error :(");
    return _react.default.createElement(ContactFormPage, data.projectTemplate);
  });
}

var ContactFormPageComponent =
/*#__PURE__*/
function (_React$PureComponent) {
  (0, _inherits2.default)(ContactFormPageComponent, _React$PureComponent);

  function ContactFormPageComponent() {
    var _getPrototypeOf2;

    var _temp, _this;

    (0, _classCallCheck2.default)(this, ContactFormPageComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (0, _possibleConstructorReturn2.default)(_this, (_temp = _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(ContactFormPageComponent)).call.apply(_getPrototypeOf2, [this].concat(args))), _this.state = {
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
    }, _this.hideModal = function () {
      return _this.setState({
        confirm: false
      });
    }, _this.handleChange = function (e, _ref2) {
      var name = _ref2.name,
          value = _ref2.value;
      return _this.setState((0, _defineProperty2.default)({}, name, value));
    }, _this.handleSubmit = function () {
      var _this$props = _this.props,
          mutate = _this$props.mutate,
          title = _this$props.title,
          _id = _this$props._id;
      var _this$state = _this.state,
          confirm = _this$state.confirm,
          error = _this$state.error,
          request = (0, _objectWithoutProperties2.default)(_this$state, ["confirm", "error"]); // const data = {
      //   event: 'project_request_submission', ...request, projectId: _id, projectTitle: title,
      // };

      mutate({
        variables: (0, _objectSpread2.default)({}, request)
      });

      _firstcutAnalytics.default.trackFormSubmission((0, _objectSpread2.default)({
        projectId: _id,
        projectTitle: title
      }, request)); // Meteor.call('postRequest', data, (err) => {
      //   if (err) {
      //     this.setState({ error: err });
      //   } else {
      //     this.setState({
      //       confirm: true, firstName: '', lastName: '', website: '', company: '', email: '', budget: '', location: '', about: '',
      //     });
      //   }
      // });

    }, _temp));
  }

  (0, _createClass2.default)(ContactFormPageComponent, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          title = _this$props2.title,
          description = _this$props2.description,
          exampleUrl = _this$props2.exampleUrl;
      var _this$state2 = this.state,
          confirm = _this$state2.confirm,
          error = _this$state2.error,
          fields = (0, _objectWithoutProperties2.default)(_this$state2, ["confirm", "error"]);
      var columnStyle = {
        paddingTop: '100px'
      };
      return _react.default.createElement("div", {
        style: {
          height: '100%'
        }
      }, _react.default.createElement(_firstcutUi.Modal, {
        open: confirm,
        basic: true,
        size: "small",
        onClick: this.hideModal
      }, _react.default.createElement(_firstcutUi.Header, {
        icon: "checkmark",
        content: "Thank you for your request"
      }), _react.default.createElement(_firstcutUi.Modal.Content, null, "We will be in touch soon!"), _react.default.createElement(_firstcutUi.Modal.Actions, null, _react.default.createElement(_firstcutUi.Button, {
        color: "green",
        inverted: true,
        onClick: this.hideModal
      }, "CONFIRM"))), _react.default.createElement(_firstcutUi.Grid, {
        stackable: true,
        style: {
          height: '100%'
        },
        onClick: this.hideModal,
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
        formFields: fields,
        handleSubmit: this.handleSubmit,
        handleChange: this.handleChange
      }))));
    }
  }]);
  return ContactFormPageComponent;
}(_react.default.PureComponent);

var ContactFormPage = (0, _reactApollo.graphql)(addRequestMutation)(ContactFormPageComponent);

function ContactForm(props) {
  var handleChange = props.handleChange,
      handleSubmit = props.handleSubmit,
      formFields = props.formFields;
  var firstName = formFields.firstName,
      lastName = formFields.lastName,
      website = formFields.website,
      company = formFields.company,
      email = formFields.email,
      budget = formFields.budget,
      location = formFields.location,
      about = formFields.about;
  return _react.default.createElement("div", {
    className: "signup__form"
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
  })), _react.default.createElement(_firstcutUi.Responsive, {
    as: _firstcutUi.Form.Button,
    fluid: true,
    color: "green",
    maxWidth: 100000,
    content: "SUBMIT",
    onClick: handleSubmit
  })));
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

var _default = Contact;
exports.default = _default;