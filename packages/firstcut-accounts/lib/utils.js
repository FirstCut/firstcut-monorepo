"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = _interopRequireDefault(require("./config.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  capitalize: function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  getServiceNames: function getServiceNames() {
    if (!Package['accounts-oauth']) {
      // no oauth package so no services
      return [];
    }

    return Accounts.oauth.serviceNames().sort();
  },
  hasPasswordService: function hasPasswordService() {
    return !!Package['accounts-password'];
  },
  performOAuthLogin: function performOAuthLogin(service, cb) {
    try {
      // @todo this can be done better, multi word services may not work
      // @todo options need to passed from Accounts.ui.config
      var options = _config.default[service].options || {};
      Meteor["loginWith".concat(this.capitalize(service))](options, cb);
    } catch (e) {
      cb(e);
    }
  },
  onError: function onError(error) {
    // todo don't know how to handle situation then "is required" error
    // was happen and after field was filled other error happens in same
    // field
    // this is more looks like client-side validation logic. We take
    // away this part temporary

    /* let errors = this.state.errors;
          if (~~errors.indexOf(error)) {
         errors.push(error);
         this.setState({ errors: errors });
         } */
    var errors = [];
    errors.push(error);
    this.setState({
      errors: errors
    });
  },
  clearErrors: function clearErrors() {
    this.setState({
      errors: []
    });
  }
};
exports.default = _default;