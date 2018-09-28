"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _stringify = _interopRequireDefault(require("@babel/runtime/core-js/json/stringify"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _lambda = _interopRequireDefault(require("aws-sdk/clients/lambda"));

var REGION = Meteor.settings.public.aws.region;

_awsSdk.default.config.update({
  region: REGION
});

_awsSdk.default.config.credentials = new _awsSdk.default.CognitoIdentityCredentials({
  IdentityPoolId: Meteor.settings.public.aws.identityPoolId
});
var lambda = new _lambda.default({
  region: REGION
});
var params = {
  FunctionName: lambda.snippet_creator,
  InvocationType: 'RequestResponse',
  LogType: 'Tail',
  Payload: (0, _stringify.default)({
    result: 'TESTING'
  })
};
lambda.invoke({}, function (err, result) {
  var error_msg = err || result.Payload.errorMessage;

  if (error_msg) {
    reject(error_msg);
  } else {
    resolve(result);
  }
});