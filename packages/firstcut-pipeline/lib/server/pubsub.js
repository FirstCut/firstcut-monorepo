"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initSubscriptions;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _pubsubJs = require("pubsub-js");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _firstcutUserSession = require("firstcut-user-session");

var _execute = require("../execute.actions");

function initSubscriptions(Models) {
  var Cut = Models.Cut,
      Deliverable = Models.Deliverable,
      Shoot = Models.Shoot,
      Invoice = Models.Invoice;
  /* Listens to all records for updates to all keys in COLLABORATOR_TYPES_TO_LABELS */

  /* Publishes a 'collaborator_added' event if a collaborator has changed */

  function collaboratorsChanged(record, prevRecord) {
    var result = false;
    var typeKeys = Object.keys(_firstcutPipelineConsts.COLLABORATOR_TYPES_TO_LABELS);
    typeKeys.forEach(function (collaborator_key) {
      var collaborator = record[collaborator_key] || {};
      var prevCollaborator = prevRecord[collaborator_key] || {};
      var sameCollaborator = collaborator && prevCollaborator && collaborator._id === prevCollaborator._id;

      if (!sameCollaborator) {
        result = true;
      }
    });
    return result;
  }

  function notifyCollaboratorsTheyWereAddedOrRemoved(model, fields, prevFields) {
    var record = model.createNew(fields);
    var prevRecord = model.createNew(prevFields);
    var typeKeys = Object.keys(_firstcutPipelineConsts.COLLABORATOR_TYPES_TO_LABELS);
    typeKeys.forEach(function (collaborator_key) {
      var collaborator = record[collaborator_key] || {};
      var prevCollaborator = prevRecord[collaborator_key] || {};

      if (collaborator && prevCollaborator && collaborator._id === prevCollaborator._id) {
        return;
      }

      var gig_type = record.modelName;
      var gig_id = record._id;

      if (collaborator && collaborator._id) {
        _pubsubJs.PubSub.publish('collaborator_added', {
          record_id: collaborator._id,
          record_type: 'Collaborator',
          gig_type: gig_type,
          gig_id: gig_id,
          collaborator_key: collaborator_key
        });
      }
    });
  }

  var initializing = true;
  var query = Meteor.settings.public.environment === 'development' ? {} : {
    isDummy: {
      $ne: true
    }
  };
  Shoot.collection.find({}).observe({
    // allow actions on dummy shoots for videographer training purposes
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
    changed: function changed(fields, prevFields) {
      if (initializing) {
        return;
      }

      var shoot = new Shoot(fields);
      var prevShoot = new Shoot(prevFields);
      var screenshots = shoot.screenshots.toArray();
      var prevScreenshots = prevShoot.screenshots.toArray();
      var prevDate = (0, _moment.default)(prevShoot.date);
      var date = (0, _moment.default)(shoot.date);
      var sameDate = prevDate && prevDate.isSame(date);
      var prevExtraAttendees = prevShoot.extraCalendarEventAttendees || [];
      var extraAttendees = shoot.extraCalendarEventAttendees || [];
      var extraAttendeesChanged = !_lodash._.isEqual(extraAttendees, prevExtraAttendees);
      var prevLocation = prevShoot.location || {};
      var location = shoot.location || null;
      var locationChanged = location && location.place_id !== prevLocation.place_id;
      var preproductionStatusChanged = shoot.preproHasBeenKickedOff && !prevShoot.preproHasBeenKickedOff;

      if (!sameDate || extraAttendeesChanged || collaboratorsChanged(shoot, prevShoot) || locationChanged || preproductionStatusChanged) {
        if (shoot.preproHasBeenKickedOff && !shoot.isDummy) {
          _pubsubJs.PubSub.publish('shoot_event_updated', {
            record_id: shoot._id,
            record_type: 'Shoot'
          });
        }
      }

      if (screenshots.length > prevScreenshots.length) {
        var uploaded = _lodash._.last(_lodash._.differenceBy(screenshots, prevScreenshots, function (s) {
          return s.filename;
        }));

        _pubsubJs.PubSub.publish('screenshot_uploaded', {
          record_id: shoot._id,
          screenshot: uploaded,
          record_type: 'Shoot'
        });
      }

      var approvalChanged = _lodash._.last(_lodash._.differenceBy(screenshots, prevScreenshots, function (s) {
        return s.filename + s.notes + s.approved;
      }));

      if (approvalChanged && Shoot.screenshotApproved(approvalChanged)) {
        _pubsubJs.PubSub.publish('screenshot_approved', {
          record_id: shoot._id,
          screenshot: approvalChanged,
          record_type: 'Shoot'
        });
      }

      if (approvalChanged && Shoot.screenshotRejected(approvalChanged)) {
        _pubsubJs.PubSub.publish('screenshot_rejected', {
          record_id: shoot._id,
          screenshot: approvalChanged,
          record_type: 'Shoot'
        });
      }

      if (shoot.checkouts.length > prevShoot.checkouts.length) {
        var collaboratorKey = shoot.latestCheckout.collaboratorKey;

        _pubsubJs.PubSub.publish('shoot_checkout', {
          record_id: shoot._id,
          collaborator_key: collaboratorKey,
          record_type: 'Shoot'
        });
      }

      if (shoot.checkins.length > prevShoot.checkins.length) {
        var _collaboratorKey = shoot.latestCheckin.collaboratorKey;

        _pubsubJs.PubSub.publish('shoot_checkin', {
          collaborator_key: _collaboratorKey,
          record_id: shoot._id,
          record_type: 'Shoot'
        });
      }

      notifyCollaboratorsTheyWereAddedOrRemoved(Models.Shoot, fields, prevFields);
    }
  });
  Cut.collection.find(query).observe({
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
    changed: function changed(fields, prevFields) {
      if (initializing) {
        return;
      }

      var cut = new Cut(fields);
      var prevCut = new Cut(prevFields);

      if (cut.hasFile && !prevCut.hasFile) {
        _pubsubJs.PubSub.publish('cut_uploaded', {
          record_id: cut._id,
          record_type: Cut.modelName
        });
      }
    }
  });
  Invoice.collection.find(query).observe({
    added: function added(doc) {
      if (initializing) {
        return;
      }

      var invoice = Invoice.fromId(doc._id);

      if (invoice.isDue()) {
        _pubsubJs.PubSub.publish('invoice_set_to_due', {
          record_id: doc._id,
          record_type: Invoice.modelName
        });
      }
    },
    changed: function changed(fields, prevFields) {
      if (initializing) {
        return;
      }

      var invoice = new Invoice(fields);
      var prevInvoice = new Invoice(prevFields);

      if (!prevInvoice.isDue() && invoice.isDue()) {
        _pubsubJs.PubSub.publish('invoice_set_to_due', {
          record_id: invoice._id,
          record_type: Invoice.modelName
        });
      }
    }
  });
  Deliverable.collection.find(query).observe({
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
    changed: function changed(fields, prevFields) {
      if (initializing) {
        return;
      }

      var deliverable = new Deliverable(fields);
      var prevDeliverable = new Deliverable(prevFields);
      var prevDue = (0, _moment.default)(prevDeliverable.nextCutDue);
      var due = (0, _moment.default)(deliverable.nextCutDue);
      var sameDate = prevDue && prevDue.isSame(due);

      if (!sameDate || collaboratorsChanged(deliverable, prevDeliverable)) {
        _pubsubJs.PubSub.publish('cut_due_event_updated', {
          record_id: deliverable._id,
          record_type: 'Deliverable'
        });
      }
    }
  });
  Models.allModels.forEach(function (model) {
    if (model.modelName === 'Asset') {
      return;
    }

    if (model.modelName === 'LandingPageRequest') {
      return;
    }

    var initializing = true;

    if ([Models.Job.modelName, Models.Cut.modelName].includes(model.modelName)) {
      return;
    }

    model.collection.find(query).observe({
      added: function added(doc) {
        if (initializing) {
          return;
        }

        var record = Models.getRecordFromId(model.modelName, doc._id);
        var user = Meteor.users.findOne(record.createdBy);
        var initiator_player_id = (0, _firstcutUserSession.getPlayerIdFromUser)(user);

        _pubsubJs.PubSub.publish('record_created', {
          record_id: doc._id,
          initiator_player_id: initiator_player_id,
          record_type: model.modelName
        });

        var dependentRecords = record.generateDependentRecords(doc.createdBy);
        dependentRecords.forEach(function (r) {
          r.save();
        });
      }
    });
    initializing = false;
  });
  Meteor.users.find({}).observe({
    added: function added(doc) {
      if (initializing) {
        return;
      }

      handleNewUser(doc);
    },
    changed: function changed(fields, prevFields) {
      if (initializing) {
        return;
      }

      var newPlayerId = (0, _firstcutUserSession.getPlayerIdFromUser)(fields);
      var oldPlayerId = (0, _firstcutUserSession.getPlayerIdFromUser)(prevFields);

      if (newPlayerId && newPlayerId !== oldPlayerId) {
        handleNewUser(fields);
      }
    }
  });

  function handleNewUser(user) {
    var playerId = (0, _firstcutUserSession.getPlayerIdFromUser)(user);

    if (playerId) {
      var player = Models.getPlayerFromQuery({
        _id: playerId
      });

      if (player && !player.hasUserProfile) {
        player = player.set('hasUserProfile', true);
        player.save();
      }
    }
  }

  _firstcutPipelineConsts.SUPPORTED_EVENTS.forEach(function (e) {
    _pubsubJs.PubSub.subscribe(e, Meteor.bindEnvironment(function (msg, data) {
      (0, _execute.handleEvent)((0, _objectSpread2.default)({
        event: e
      }, data));
    }));
  });

  initializing = false;
}