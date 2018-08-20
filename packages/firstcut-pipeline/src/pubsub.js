
import { PubSub } from 'pubsub-js';
import { COLLABORATOR_TYPES_TO_LABELS, SUPPORTED_EVENTS } from 'firstcut-enum';
import { getPlayerIdFromUser } from 'firstcut-utils';
import { Models } from 'firstcut-models';
import { _ } from 'lodash';
import moment from 'moment';
import { handleEvent } from './execute.actions';

export default function initSubscriptions() {
  if (!Meteor.isServer) {
    return;
  }
  const { Cut, Deliverable, Shoot } = Models;

  /* Listens to all records for updates to all keys in COLLABORATOR_TYPES_TO_LABELS */
  /* Publishes a 'collaborator_added' event if a collaborator has changed */
  function collaboratorsChanged(record, prev_record) {
    let result = false;
    const type_keys = Object.keys(COLLABORATOR_TYPES_TO_LABELS);
    type_keys.forEach((collaborator_key) => {
      const collaborator = record[collaborator_key] || {};
      const prev_collaborator = prev_record[collaborator_key] || {};
      if (collaborator && prev_collaborator && collaborator._id == prev_collaborator._id) {

      } else {
        result = true;
      }
    });
    return result;
  }

  function notifyCollaboratorsTheyWereAddedOrRemoved(model, fields, prev_fields) {
    const record = model.createNew(fields);
    const prev_record = model.createNew(prev_fields);
    const type_keys = Object.keys(COLLABORATOR_TYPES_TO_LABELS);
    type_keys.forEach((collaborator_key) => {
      const collaborator = record[collaborator_key] || {};
      const prev_collaborator = prev_record[collaborator_key] || {};
      if (collaborator && prev_collaborator && collaborator._id == prev_collaborator._id) {
        return;
      }
      const gig_type = record.model_name;
      const gig_id = record._id;
      if (collaborator && collaborator._id) {
        PubSub.publish('collaborator_added', {
          record_id: collaborator._id, record_type: 'Collaborator', gig_type, gig_id, collaborator_key,
        });
      }
      // if (prev_collaborator && prev_collaborator._id) {
      //   PubSub.publish(EVENTS.collaborator_removed, {record_id: prev_collaborator._id, record_type: 'Collaborator', gig_type, gig_id, collaborator_key});
      // }
    });
  }

  let initializing = true;
  Shoot.collection.find({}).observe({
    added: (doc) => {
      if (initializing) {
        return;
      }
      const shoot = new Shoot(doc);
      PubSub.publish('shoot_created', { record_id: shoot._id, record_type: 'Shoot' });
    },
    changed: (fields, prev_fields) => {
      if (initializing) {
        return;
      }
      const shoot = new Shoot(fields);
      const prev_shoot = new Shoot(prev_fields);
      const screenshots = shoot.screenshots.toArray();
      const prev_screenshots = prev_shoot.screenshots.toArray();
      const prev_date = moment(prev_shoot.date);
      const date = moment(shoot.date);
      const same_date = prev_date && prev_date.isSame(date);
      const prev_location = prev_shoot.location || {};
      const location = shoot.location || null;
      const location_changed = location && location.place_id != prev_location.place_id;
      const preproduction_status_changed = shoot.preproHasBeenKickedOff && !prev_shoot.preproHasBeenKickedOff;
      if (!same_date || collaboratorsChanged(shoot, prev_shoot) || location_changed || preproduction_status_changed) {
        if (shoot.preproHasBeenKickedOff) {
          PubSub.publish('shoot_event_updated', { record_id: shoot._id, record_type: 'Shoot' });
        }
      }
      if (screenshots.length > prev_screenshots.length) {
        const uploaded = _.last(_.differenceBy(screenshots, prev_screenshots, s => s.filename));
        PubSub.publish('screenshot_uploaded', { record_id: shoot._id, screenshot: uploaded, record_type: 'Shoot' });
      }
      const approval_changed = _.last(_.differenceBy(screenshots, prev_screenshots, s => s.filename + s.notes + s.approved));
      if (approval_changed && shoot.screenshotApproved(approval_changed)) {
        PubSub.publish('screenshot_approved', { record_id: shoot._id, screenshot: approval_changed, record_type: 'Shoot' });
      }
      if (approval_changed && shoot.screenshotRejected(approval_changed)) {
        PubSub.publish('screenshot_rejected', { record_id: shoot._id, screenshot: approval_changed, record_type: 'Shoot' });
      }
      if (shoot.checkouts.length > prev_shoot.checkouts.length) {
        const { collaboratorKey } = shoot.latestCheckout;
        PubSub.publish('shoot_checkout', { record_id: shoot._id, collaborator_key: collaboratorKey, record_type: 'Shoot' });
      }
      if (shoot.checkins.length > prev_shoot.checkins.length) {
        const { collaboratorKey } = shoot.latestCheckin;
        PubSub.publish('shoot_checkin', { collaborator_key: collaboratorKey, record_id: shoot._id, record_type: 'Shoot' });
      }
      notifyCollaboratorsTheyWereAddedOrRemoved(Models.Shoot, fields, prev_fields);
    },
  });

  Cut.collection.find({}).observe({
    added: (doc) => {
      if (initializing) {
        return;
      }
      const cut = Cut.fromId(doc._id);
      if (cut.hasFile) {
        PubSub.publish('cut_uploaded', { record_id: doc._id, record_type: 'Cut' });
      }
    },
    changed: (fields, prev_fields) => {
      if (initializing) {
        return;
      }
      const cut = new Cut(fields);
      const prev_cut = new Cut(prev_fields);
      if (cut.hasFile && !prev_cut.hasFile) {
        PubSub.publish('cut_uploaded', { record_id: cut._id, record_type: Cut.model_name });
      }
    },
  });

  Deliverable.collection.find({}).observe({
    added: (doc) => {
      if (initializing) {
        return;
      }
      const deliverable = Deliverable.fromId(doc._id);
      if (deliverable.nextCutDue) {
        PubSub.publish('cut_due_event_updated', { record_id: doc._id, record_type: 'Deliverable' });
      }
    },
    changed: (fields, prev_fields) => {
      if (initializing) {
        return;
      }
      const deliverable = new Deliverable(fields);
      const prev_deliverable = new Deliverable(prev_fields);
      const prev_due = moment(prev_deliverable.nextCutDue);
      const due = moment(deliverable.nextCutDue);
      const same_date = prev_due && prev_due.isSame(due);
      if (!same_date || collaboratorsChanged(deliverable, prev_deliverable)) {
        PubSub.publish('cut_due_event_updated', { record_id: deliverable._id, record_type: 'Deliverable' });
      }
    },
  });

  Models.allModels.forEach((model) => {
    if (model.model_name === 'Asset') {
      return;
    }
    let initializing = true;
    if ([Models.Job.model_name, Models.Cut.model_name].includes(model.model_name)) {
      return;
    }
    model.collection.find({}).observe({
      added: (doc) => {
        if (initializing) {
          return;
        }
        const user = Meteor.users.findOne(doc.createdBy);
        const initiator_player_id = getPlayerIdFromUser(user);
        PubSub.publish('record_created', { record_id: doc._id, initiator_player_id, record_type: model.model_name });

        // generate and save all dependent records //TODO this will need to be removed into a separate service
        const record = Models.getRecordFromId(model.model_name, doc._id);
        const dependent_records = record.generateDependentRecords(doc.createdBy);
        dependent_records.forEach((r) => {
          r.save();
        });
      },
    });
    initializing = false;
  });


  SUPPORTED_EVENTS.forEach((e) => {
    PubSub.subscribe(e, Meteor.bindEnvironment((msg, data) => {
      handleEvent.call({ event: e, ...data });
    }));
  });

  initializing = false;
}
