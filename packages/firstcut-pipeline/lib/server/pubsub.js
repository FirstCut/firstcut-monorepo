"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initSubscriptions;

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _pubsubJs = require("pubsub-js");

var _firstcutEnum = require("firstcut-enum");

var _index = require("../index.js");

var _firstcutUtils = require("firstcut-utils");

var _immutable = require("immutable");

var _firstcutModels = require("firstcut-models");

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function initSubscriptions() {
  var Cut = _firstcutModels.Models.Cut,
      Deliverable = _firstcutModels.Models.Deliverable,
      Shoot = _firstcutModels.Models.Shoot;
  /* Listens to all records for updates to all keys in COLLABORATOR_TYPES_TO_LABELS */

  /* Publishes a 'collaborator_added' event if a collaborator has changed */

  function collaboratorsChanged(record, prev_record) {
    var result = false;
    var type_keys = Object.keys(_firstcutEnum.COLLABORATOR_TYPES_TO_LABELS);
    type_keys.forEach(function (collaborator_key) {
      var collaborator = record[collaborator_key] || {};
      var prev_collaborator = prev_record[collaborator_key] || {};

      if (collaborator && prev_collaborator && collaborator._id == prev_collaborator._id) {
        return;
      } else {
        result = true;
      }
    });
    return result;
  }

  function notifyCollaboratorsTheyWereAddedOrRemoved(model, fields, prev_fields) {
    var record = model.createNew(fields);
    var prev_record = model.createNew(prev_fields);
    var type_keys = Object.keys(_firstcutEnum.COLLABORATOR_TYPES_TO_LABELS);
    type_keys.forEach(function (collaborator_key) {
      var collaborator = record[collaborator_key] || {};
      var prev_collaborator = prev_record[collaborator_key] || {};

      if (collaborator && prev_collaborator && collaborator._id == prev_collaborator._id) {
        return;
      }

      var gig_type = record.model_name;
      var gig_id = record._id;

      if (collaborator && collaborator._id) {
        _pubsubJs.PubSub.publish('collaborator_added', {
          record_id: collaborator._id,
          record_type: 'Collaborator',
          gig_type: gig_type,
          gig_id: gig_id,
          collaborator_key: collaborator_key
        });
      } // if (prev_collaborator && prev_collaborator._id) {
      //   PubSub.publish(EVENTS.collaborator_removed, {record_id: prev_collaborator._id, record_type: 'Collaborator', gig_type, gig_id, collaborator_key});
      // }

    });
  }

  var initializing = true;
  Shoot.collection.find({}).observe({
    added: function added(doc) {
      if (initializing) {
        return;
      }

      var shoot = new Shoot(doc);

      _pubsubJs.PubSub.publish('shoot_created', {
        record_id: shoot._id,
        record_type: 'Shoot'
      });
    },
    changed: function changed(fields, prev_fields) {
      if (initializing) {
        return;
      }

      var shoot = new Shoot(fields);
      var prev_shoot = new Shoot(prev_fields);
      var screenshots = shoot.screenshots.toArray();
      var prev_screenshots = prev_shoot.screenshots.toArray();
      var prev_date = (0, _moment.default)(prev_shoot.date);
      var date = (0, _moment.default)(shoot.date);
      var same_date = prev_date && prev_date.isSame(date);
      var prev_location = prev_shoot.location || {};
      var location = shoot.location || null;
      var location_changed = location && location.place_id != prev_location.place_id;
      var preproduction_status_changed = shoot.preproHasBeenKickedOff && !prev_shoot.preproHasBeenKickedOff;

      if (!same_date || collaboratorsChanged(shoot, prev_shoot) || location_changed || preproduction_status_changed) {
        if (shoot.preproHasBeenKickedOff) {
          _pubsubJs.PubSub.publish('shoot_event_updated', {
            record_id: shoot._id,
            record_type: 'Shoot'
          });
        }
      }

      if (screenshots.length > prev_screenshots.length) {
        var uploaded = _lodash._.last(_lodash._.differenceBy(screenshots, prev_screenshots, function (s) {
          return s.filename;
        }));

        _pubsubJs.PubSub.publish('screenshot_uploaded', {
          record_id: shoot._id,
          screenshot: uploaded,
          record_type: 'Shoot'
        });
      }

      var approval_changed = _lodash._.last(_lodash._.differenceBy(screenshots, prev_screenshots, function (s) {
        return s.filename + s.notes + s.approved;
      }));

      if (approval_changed && shoot.screenshotApproved(approval_changed)) {
        _pubsubJs.PubSub.publish('screenshot_approved', {
          record_id: shoot._id,
          screenshot: approval_changed,
          record_type: 'Shoot'
        });
      }

      if (approval_changed && shoot.screenshotRejected(approval_changed)) {
        _pubsubJs.PubSub.publish('screenshot_rejected', {
          record_id: shoot._id,
          screenshot: approval_changed,
          record_type: 'Shoot'
        });
      }

      if (shoot.checkouts.length > prev_shoot.checkouts.length) {
        var collaboratorKey = shoot.latestCheckout.collaboratorKey;

        _pubsubJs.PubSub.publish('shoot_checkout', {
          record_id: shoot._id,
          collaborator_key: collaboratorKey,
          record_type: 'Shoot'
        });
      }

      if (shoot.checkins.length > prev_shoot.checkins.length) {
        var _collaboratorKey = shoot.latestCheckin.collaboratorKey;

        _pubsubJs.PubSub.publish('shoot_checkin', {
          collaborator_key: _collaboratorKey,
          record_id: shoot._id,
          record_type: 'Shoot'
        });
      }

      notifyCollaboratorsTheyWereAddedOrRemoved(_firstcutModels.Models.Shoot, fields, prev_fields);
    }
  });
  Cut.collection.find({}).observe({
    added: function added(doc) {
      if (initializing) {
        return;
      }

      var cut = Cut.fromId(doc._id);

      if (cut.hasFile) {
        _pubsubJs.PubSub.publish('cut_uploaded', {
          record_id: doc._id,
          record_type: 'Cut'
        });
      }
    },
    changed: function changed(fields, prev_fields) {
      if (initializing) {
        return;
      }

      var cut = new Cut(fields);
      var prev_cut = new Cut(prev_fields);

      if (cut.hasFile && !prev_cut.hasFile) {
        _pubsubJs.PubSub.publish('cut_uploaded', {
          record_id: cut._id,
          record_type: Cut.model_name
        });
      }
    }
  });
  Deliverable.collection.find({}).observe({
    added: function added(doc) {
      if (initializing) {
        return;
      }

      var deliverable = Deliverable.fromId(doc._id);

      if (deliverable.nextCutDue) {
        _pubsubJs.PubSub.publish('cut_due_event_updated', {
          record_id: doc._id,
          record_type: 'Deliverable'
        });
      }
    },
    changed: function changed(fields, prev_fields) {
      if (initializing) {
        return;
      }

      var deliverable = new Deliverable(fields);
      var prev_deliverable = new Deliverable(prev_fields);
      var prev_due = (0, _moment.default)(prev_deliverable.nextCutDue);
      var due = (0, _moment.default)(deliverable.nextCutDue);
      var same_date = prev_due && prev_due.isSame(due);

      if (!same_date || collaboratorsChanged(deliverable, prev_deliverable)) {
        _pubsubJs.PubSub.publish('cut_due_event_updated', {
          record_id: deliverable._id,
          record_type: 'Deliverable'
        });
      }
    }
  });

  _firstcutModels.Models.allModels.forEach(function (model) {
    if (model.model_name == 'Asset') {
      return;
    }

    var initializing = true;

    if ([_firstcutModels.Models.Job.model_name, _firstcutModels.Models.Cut.model_name].includes(model.model_name)) {
      return;
    }

    model.collection.find({}).observe({
      added: function added(doc) {
        console.log('ADDED');

        if (initializing) {
          return;
        }

        var user = Meteor.users.findOne(doc.createdBy);
        var initiator_player_id = (0, _firstcutUtils.getPlayerIdFromUser)(user);

        _pubsubJs.PubSub.publish('record_created', {
          record_id: doc._id,
          initiator_player_id: initiator_player_id,
          record_type: model.model_name
        }); //generate and save all dependent records //TOOD this will need to be removed into a separate service


        var record = _firstcutModels.Models.getRecordFromId(model.model_name, doc._id);

        var dependent_records = record.generateDependentRecords(doc.createdBy);
        dependent_records.forEach(function (r) {
          var defaultCreatedBy = '111111';
          var createdBy = doc.createdBy ? doc.createdBy : defaultCreatedBy;
          r = r.set('createdBy', createdBy);
          r.save();
        });
      }
    });
    initializing = false;
  });

  _firstcutEnum.SUPPORTED_EVENTS.forEach(function (e) {
    _pubsubJs.PubSub.subscribe(e, Meteor.bindEnvironment(function (msg, data) {
      _index.handleEvent.call({
        event_data: _objectSpread({
          event: e
        }, data)
      });
    }));
  });

  initializing = false;
}