
import Collaborator from 'firstcut-collaborators';
import Company from 'firstcut-companies';
import Client from 'firstcut-clients';
import Shoot from 'firstcut-shoots';
import Project from 'firstcut-projects';
import Cut from 'firstcut-cuts';
import Deliverable from 'firstcut-deliverables';
import Invoice from 'firstcut-invoices';
import Job from 'firstcut-jobs';
import Asset from 'firstcut-assets';
import Task from 'firstcut-tasks';
import Message from 'firstcut-messages';
import LandingPageRequest from 'firstcut-landingpage-requests';
import { _ } from 'lodash';
import enablePlayerUtils from 'firstcut-players';
import SimpleSchema from 'simpl-schema';
import oid from 'mdbid';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
// import enableCrud from './crud';

let Models = {};

SimpleSchema.extendOptions([
  'helpText',
  'sortBy',
  'options',
  'placeholder',
  'hidden',
  'customType',
  'rows',
  'store',
  'bucket',
  'serviceFilter',
  'enumOptions',
  'unique',
  'restricted',
  'customAutoValue',
  'serviceDependency',
]);

const models = ({
  Collaborator,
  Task,
  Client,
  Company,
  Project,
  Shoot,
  Deliverable,
  Invoice,
  Job,
  Asset,
  Cut,
  Message,
  LandingPageRequest,
});

const legacyModels = Object.freeze({
  COLLABORATOR: Collaborator,
  CLIENT: Client,
  COMPANY: Company,
  PROJECT: Project,
  SHOOT: Shoot,
  DELIVERABLE: Deliverable,
  INVOICE: Invoice,
  CUT: Cut,
});


// dependency injection solved by pulling this out into another object?
Object.keys(models).forEach((i) => {
  const model = models[i];
  model.models = models;
  model.modelName = i;
});

Models = {
  allModels: Object.values(models),
  ...models,
  ...legacyModels,
  getRecordFromId(type, id) {
    const model = models[type];
    return model.fromId(id);
  },
  getRecordFromQuery(type, query) {
    const model = models[type];
    return model.findOne(query);
  },
};

class RecordPersister {
  static save(record) {
    return new Promise((resolve, reject) => {
      const cleaned = this.clean(record);
      this.validate(record.modelName, cleaned);
      // this.onSave(cleaned).then(resolve).catch(reject);
      saveRecord.call({ record: cleaned, modelName: record.modelName }, (err, updatedRecord) => {
        if (err) reject(err);
        const newRecord = record.constructor.createNew(updatedRecord);
        resolve(newRecord);
      });
    });
  }

  static remove(record) {
    removeRecord.call({ record: record.toJS(), modelName: record.modelName }, (err) => {
      console.log('REMOVING RECORD');
      if (err) {
        console.log(err);
      }
    });
  }

  static validate(modelName, record) {
    Models[modelName].validate(record);
  }

  static getClean(record) {
    return record.schema.clean;
  }

  static clean(record) {
    return record.schema.clean(record.toJS());
  }
}

const saveRecord = new ValidatedMethod({
  name: 'save_record',
  validate: () => {},
  run({ record, modelName }) {
    console.log('SAVING');
    if (!record._id) {
      record._id = oid();
    }
    const collection = Models[modelName].collection;
    collection.upsert(record._id, { $set: record });
    return record;
  },
});

const removeRecord = new ValidatedMethod({
  name: 'removeRecord',
  validate: () => {},
  run({ record, modelName }) {
    if (Meteor.isServer) {
      const collection = Models[modelName].collection;
      collection.remove(record._id);
    }
  },
});


_.forEach(Models.allModels, (model) => {
  if (!model.collection) {
    const collection = new Mongo.Collection(model.collectionName);
    model.collection = collection;
  }
  model.persister = RecordPersister;
  if (model.onInitCollection) {
    model.onInitCollection();
  }
});

enablePlayerUtils(Models);

export default Models;
