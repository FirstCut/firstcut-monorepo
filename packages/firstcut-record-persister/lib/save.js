"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.save = save;

var request = require('request');

function save(collection_name, record) {
  request.post('http://mup-env-firstcut-crud-server.xn68ajdbdc.us-west-2.elasticbeanstalk.com/', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred

    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

    console.log('body:', body); // Print the HTML for the Google homepage.
  });
}