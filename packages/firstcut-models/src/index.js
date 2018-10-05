
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
import initPublications from './utils/publications';

import enableCrud from './utils/crud';
import enableBasePublications from './utils/publications.base';

const models = Object.freeze({
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
});

const Models = {
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

Object.keys(models).forEach((key) => {
  const model = models[key];
  model.modelName = key;
});

export function initModels(ValidatedMethod) {
  console.log('INIT MODELING');
  if (Meteor.isServer) {
    initPublications(Models);
  }
  Object.keys(models).forEach((key) => {
    const model = models[key];
    enableBasePublications(model);
    enableCrud(model, ValidatedMethod);
    console.log('DOES MODEL HAVE COLLECTION?');
    console.log(model.modelName);
    if (!model.collection) {
      console.log('MAKING COLLECTIONS');
      const collection = new Mongo.Collection(model.collectionName);
      collection.attachSchema(model.schema.asSchema);
      model.collection = collection;
    }
    if (model.onInit) {
      model.onInit();
    }
  });

  // dependency injection solved by pulling this out into another object?
  Object.keys(models).forEach((i) => {
    const model = models[i];
    model.models = models;
  });
}

export default Models;
