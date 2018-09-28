"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _cryptoJs = _interopRequireDefault(require("crypto-js"));

var _http = require("meteor/http");

var _pubsubJs = require("pubsub-js");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _random = require("meteor/random");

var _pipeline = require("/imports/api/pipeline");

_http.HTTP.methods({
  computeSignature: function computeSignature(data) {
    var date = this.query.datetime.substr(0, 8);
    var stringToSign = this.query.to_sign;
    var kDate = hmac("AWS4".concat(Meteor.settings.s3.secret), date);
    var kRegion = hmac(kDate, Meteor.settings.public.s3.region);
    var kService = hmac(kRegion, 's3');
    var kSigning = hmac(kService, 'aws4_request');
    var signature = hmac(kSigning, stringToSign);
    return signature.toString();
  },
  handleEvent: function handleEvent(args) {
    var data = this.query;
    return (0, _pipeline.handleEvent)(data);
  },
  recordExists: function recordExists(data) {
    var _this$query = this.query,
        modelName = _this$query.modelName,
        query = _this$query.query;

    var record = _firstcutModels.default.getRecordFromQuery(modelName, query);

    return {
      record: record
    };
  },
  projectHandoff: function projectHandoff() {
    var data = this.query;
    var company = data.company,
        project = data.project,
        producerEmail = data.producerEmail,
        primaryContact = data.primaryContact;
    var clients = data.clients;

    try {
      var projectRecord = _firstcutModels.default.Project.findOne({
        salesforceId: project.salesforceId
      });

      if (projectRecord) {
        return {
          error: 'project already exists'
        };
      }

      clients = JSON.parse(clients);
      var producer = producerEmail ? _firstcutModels.default.Collaborator.findOne({
        email: producerEmail
      }) : null;

      if (!producer) {
        _pubsubJs.PubSub.publish('error', {
          event_data: {
            message: 'Attempted to execute project handoff, but producer was not defined',
            data: data
          }
        });
      }

      var bareWebsite = company.website ? company.website.replace(/http[s]?:\/\//, '') : '';

      var companyRecord = _firstcutModels.default.Company.findOne({
        website: {
          $regex: bareWebsite
        }
      });

      if (!companyRecord || !bareWebsite) {
        companyRecord = _firstcutModels.default.Company.createNew((0, _objectSpread2.default)({
          _id: _random.Random.id()
        }, company));
      }

      var primaryContactId = null;
      var clientRecords = clients.map(function (c) {
        var record = _firstcutModels.default.Client.findOne({
          email: c.email,
          companyId: companyRecord._id
        });

        if (!record) {
          record = _firstcutModels.default.Client.createNew((0, _objectSpread2.default)({
            _id: _random.Random.id()
          }, c));
        }

        if (record.email === primaryContact.email) {
          primaryContactId = record._id;
        }

        record = record.set('companyId', companyRecord._id);
        return record;
      });
      console.log('PRIMAR CONTACT ID');
      console.log(primaryContactId);
      projectRecord = _firstcutModels.default.Project.createNew((0, _objectSpread2.default)({
        _id: _random.Random.id(),
        adminOwnerId: producer._id,
        clientOwnerId: primaryContactId,
        companyId: companyRecord._id
      }, project));
      companyRecord.save().catch(function (e) {
        _pubsubJs.PubSub.publish('error', {
          error: e,
          message: 'Error executing project handoff. Could not save company record',
          record: company
        });
      });
      clientRecords.forEach(function (c) {
        c.save().catch(function (e) {
          _pubsubJs.PubSub.publish('error', {
            error: e,
            message: 'Error executing project handoff. Could not save client record',
            record: c
          });
        });
      });
      projectRecord.save().then(function (record) {
        _pubsubJs.PubSub.publish('project_handoff', {
          record_id: projectRecord._id
        });
      }).catch(function (e) {
        _pubsubJs.PubSub.publish('error', {
          event_data: {
            error: e,
            message: 'Error executing project handoff. Could not save project record',
            record: project
          }
        });
      });
    } catch (e) {
      _pubsubJs.PubSub.publish('error', {
        message: 'Could not complete project handoff. Error creating records',
        error: e,
        data: data
      });

      return {
        error: e
      };
    }

    return {
      result: 'success'
    };
  }
});

function hmac(key, value) {
  return _cryptoJs.default.HmacSHA256(value, key); // return AWS.util.crypto.lib.createHmac(value, key);
}