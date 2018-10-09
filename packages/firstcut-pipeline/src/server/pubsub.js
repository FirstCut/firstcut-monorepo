
import { PubSub } from 'pubsub-js';
import { COLLABORATOR_TYPES_TO_LABELS, SUPPORTED_EVENTS } from 'firstcut-pipeline-consts';
import { _ } from 'lodash';
import moment from 'moment';
import { getPlayerIdFromUser } from 'firstcut-user-session';
import { handleEvent } from '../execute.actions';

export default function initSubscriptions(Models) {
  const {
    Cut, Deliverable, Shoot, Invoice,
  } = Models;

  /* Listens to all records for updates to all keys in COLLABORATOR_TYPES_TO_LABELS */
  /* Publishes a 'collaborator_added' event if a collaborator has changed */
  function collaboratorsChanged(record, prevRecord) {
    let result = false;
    const typeKeys = Object.keys(COLLABORATOR_TYPES_TO_LABELS);
    typeKeys.forEach((collaborator_key) => {
      const collaborator = record[collaborator_key] || {};
      const prevCollaborator = prevRecord[collaborator_key] || {};
      const sameCollaborator = (
        collaborator
        && prevCollaborator
        && collaborator._id === prevCollaborator._id
      );
      if (!sameCollaborator) {
        result = true;
      }
    });
    return result;
  }

  function notifyCollaboratorsTheyWereAddedOrRemoved(model, fields, prevFields) {
    const record = model.createNew(fields);
    const prevRecord = model.createNew(prevFields);
    const typeKeys = Object.keys(COLLABORATOR_TYPES_TO_LABELS);
    typeKeys.forEach((collaborator_key) => {
      const collaborator = record[collaborator_key] || {};
      const prevCollaborator = prevRecord[collaborator_key] || {};
      if (collaborator && prevCollaborator && collaborator._id === prevCollaborator._id) {
        return;
      }
      const gig_type = record.modelName;
      const gig_id = record._id;
      if (collaborator && collaborator._id) {
        PubSub.publish('collaborator_added', {
          record_id: collaborator._id, record_type: 'Collaborator', gig_type, gig_id, collaborator_key,
        });
      }
    });
  }

  let initializing = true;
  const query = (Meteor.settings.public.environment === 'development') ? {} : { isDummy: { $ne: true } };
  Shoot.collection.find({}).observe({ // allow actions on dummy shoots for videographer training purposes
    added: (doc) => {
      if (initializing) {
        return;
      }
      const shoot = new Shoot(doc);
      PubSub.publish('shoot_created', { record_id: shoot._id, record_type: 'Shoot' });
    },
    changed: (fields, prevFields) => {
      if (initializing) {
        return;
      }
      const shoot = new Shoot(fields);
      const prevShoot = new Shoot(prevFields);
      const screenshots = shoot.screenshots.toArray();
      const prevScreenshots = prevShoot.screenshots.toArray();
      const prevDate = moment(prevShoot.date);
      const date = moment(shoot.date);
      const sameDate = prevDate && prevDate.isSame(date);
      const prevExtraAttendees = prevShoot.extraCalendarEventAttendees || [];
      const extraAttendees = shoot.extraCalendarEventAttendees || [];
      const extraAttendeesChanged = !_.isEqual(extraAttendees, prevExtraAttendees);
      const prevLocation = prevShoot.location || {};
      const location = shoot.location || null;
      const locationChanged = location && location.place_id !== prevLocation.place_id;
      const preproductionStatusChanged = shoot.preproHasBeenKickedOff && !prevShoot.preproHasBeenKickedOff;
      if (!sameDate || extraAttendeesChanged || collaboratorsChanged(shoot, prevShoot) || locationChanged || preproductionStatusChanged) {
        if (shoot.preproHasBeenKickedOff && !shoot.isDummy) {
          PubSub.publish('shoot_event_updated', { record_id: shoot._id, record_type: 'Shoot' });
        }
      }
      if (screenshots.length > prevScreenshots.length) {
        const uploaded = _.last(_.differenceBy(screenshots, prevScreenshots, s => s.filename));
        PubSub.publish('screenshot_uploaded', { record_id: shoot._id, screenshot: uploaded, record_type: 'Shoot' });
      }
      const approvalChanged = _.last(_.differenceBy(screenshots, prevScreenshots, s => s.filename + s.notes + s.approved));
      if (approvalChanged && shoot.screenshotApproved(approvalChanged)) {
        PubSub.publish('screenshot_approved', { record_id: shoot._id, screenshot: approvalChanged, record_type: 'Shoot' });
      }
      if (approvalChanged && Shoot.screenshotRejected(approvalChanged)) {
        PubSub.publish('screenshot_rejected', { record_id: shoot._id, screenshot: approvalChanged, record_type: 'Shoot' });
      }
      if (shoot.checkouts.length > prevShoot.checkouts.length) {
        const { collaboratorKey } = shoot.latestCheckout;
        PubSub.publish('shoot_checkout', { record_id: shoot._id, collaborator_key: collaboratorKey, record_type: 'Shoot' });
      }
      if (shoot.checkins.length > prevShoot.checkins.length) {
        const { collaboratorKey } = shoot.latestCheckin;
        PubSub.publish('shoot_checkin', { collaborator_key: collaboratorKey, record_id: shoot._id, record_type: 'Shoot' });
      }
      notifyCollaboratorsTheyWereAddedOrRemoved(Models.Shoot, fields, prevFields);
    },
  });

  Cut.collection.find(query).observe({
    added: (doc) => {
      if (initializing) {
        return;
      }
      const cut = Cut.fromId(doc._id);
      if (cut.hasFile) {
        PubSub.publish('cut_uploaded', { record_id: doc._id, record_type: 'Cut' });
      }
    },
    changed: (fields, prevFields) => {
      if (initializing) {
        return;
      }
      const cut = new Cut(fields);
      const prevCut = new Cut(prevFields);
      if (cut.hasFile && !prevCut.hasFile) {
        PubSub.publish('cut_uploaded', { record_id: cut._id, record_type: Cut.modelName });
      }
    },
  });

  Invoice.collection.find(query).observe({
    added: (doc) => {
      if (initializing) {
        return;
      }
      const invoice = Invoice.fromId(doc._id);
      if (invoice.isDue()) {
        PubSub.publish('invoice_set_to_due', { record_id: doc._id, record_type: Invoice.modelName });
      }
    },
    changed: (fields, prevFields) => {
      if (initializing) {
        return;
      }
      const invoice = new Invoice(fields);
      const prevInvoice = new Invoice(prevFields);
      if (!prevInvoice.isDue() && invoice.isDue()) {
        PubSub.publish('invoice_set_to_due', { record_id: invoice._id, record_type: Invoice.modelName });
      }
    },
  });

  Deliverable.collection.find(query).observe({
    added: (doc) => {
      if (initializing) {
        return;
      }
      const deliverable = Deliverable.fromId(doc._id);
      if (deliverable.nextCutDue) {
        PubSub.publish('cut_due_event_updated', { record_id: doc._id, record_type: 'Deliverable' });
      }
    },
    changed: (fields, prevFields) => {
      if (initializing) {
        return;
      }
      const deliverable = new Deliverable(fields);
      const prevDeliverable = new Deliverable(prevFields);
      const prevDue = moment(prevDeliverable.nextCutDue);
      const due = moment(deliverable.nextCutDue);
      const sameDate = prevDue && prevDue.isSame(due);
      if (!sameDate || collaboratorsChanged(deliverable, prevDeliverable)) {
        PubSub.publish('cut_due_event_updated', { record_id: deliverable._id, record_type: 'Deliverable' });
      }
    },
  });

  Models.allModels.forEach((model) => {
    if (model.modelName === 'Asset') {
      return;
    }
    let initializing = true;
    if ([Models.Job.modelName, Models.Cut.modelName].includes(model.modelName)) {
      return;
    }
    model.collection.find(query).observe({
      added: (doc) => {
        if (initializing) {
          return;
        }
        const record = Models.getRecordFromId(model.modelName, doc._id);
        const user = Meteor.users.findOne(record.createdBy);
        const initiator_player_id = getPlayerIdFromUser(user);
        PubSub.publish('record_created', { record_id: doc._id, initiator_player_id, record_type: model.modelName });

        const dependentRecords = record.generateDependentRecords(doc.createdBy);
        dependentRecords.forEach((r) => {
          r.save();
        });
      },
    });
    initializing = false;
  });

  Meteor.users.find({}).observe({
    added: (doc) => {
      if (initializing) {
        return;
      }
      handleNewUser(doc);
    },
    changed: (fields, prevFields) => {
      if (initializing) {
        return;
      }
      const newPlayerId = getPlayerIdFromUser(fields);
      const oldPlayerId = getPlayerIdFromUser(prevFields);
      if (newPlayerId && newPlayerId !== oldPlayerId) {
        handleNewUser(fields);
      }
    },
  });

  function handleNewUser(user) {
    const playerId = getPlayerIdFromUser(user);
    if (playerId) {
      let player = Models.getPlayerFromQuery({ _id: playerId });
      if (player && !player.hasUserProfile) {
        player = player.set('hasUserProfile', true);
        player.save();
      }
    }
  }

  SUPPORTED_EVENTS.forEach((e) => {
    PubSub.subscribe(e, Meteor.bindEnvironment((msg, data) => {
      handleEvent({ event: e, ...data });
    }));
  });

  initializing = false;
}
