
import CollaboratorFactory from './factories/collaborator.factory.js';
import CompanyFactory from './factories/company.factory.js';
import ClientFactory from './factories/client.factory.js';
import ShootFactory from './factories/shoot.factory.js';
import ProjectFactory from './factories/project.factory.js';
import CutFactory from './factories/cut.factory.js';
import DeliverableFactory from './factories/deliverable.factory.js';
import InvoiceFactory from './factories/invoice.factory.js';
import JobFactory from './factories/job.factory.js';
import AssetFactory from './factories/assets.factory.js';

import {
  CollaboratorSchema,
  DeliverableSchema,
  ProjectSchema,
  ClientSchema,
  CompanySchema,
  CutSchema,
  ShootSchema,
  InvoiceSchema,
  JobSchema,
  AssetSchema
} from 'firstcut-data-schemas';

import {BaseModel} from './base.model.js';
import {FirstCutModel} from './firstcut.model.js';
import {enableCrud} from './utils/crud.js';
import generateImmutableDefaults from './utils/generate-defaults.js';

const CollaboratorBase = FirstCutModel(generateImmutableDefaults(CollaboratorSchema));
// const CollaboratorBase = FirstCutModel(generateImmutableDefaults(PublicCollaboratorSchema));
const ClientBase = FirstCutModel(generateImmutableDefaults(ClientSchema));
const ShootBase = FirstCutModel(generateImmutableDefaults(ShootSchema));
const CutBase = FirstCutModel(generateImmutableDefaults(CutSchema));
const DeliverableBase = FirstCutModel(generateImmutableDefaults(DeliverableSchema));
const CompanyBase = FirstCutModel(generateImmutableDefaults(CompanySchema));
const ProjectBase = FirstCutModel(generateImmutableDefaults(ProjectSchema));
const InvoiceBase = FirstCutModel(generateImmutableDefaults(InvoiceSchema));
const JobBase = BaseModel(generateImmutableDefaults(JobSchema));
const AssetBase = FirstCutModel(generateImmutableDefaults(AssetSchema));

const Asset = AssetFactory(AssetBase, AssetSchema);
const Collaborator = CollaboratorFactory(CollaboratorBase, CollaboratorSchema);
const Client = ClientFactory(ClientBase, ClientSchema);
const Shoot = ShootFactory(ShootBase, ShootSchema);
const Cut = CutFactory(CutBase, CutSchema);
const Deliverable = DeliverableFactory(DeliverableBase, DeliverableSchema);
const Company = CompanyFactory(CompanyBase, CompanySchema);
const Project = ProjectFactory(ProjectBase, ProjectSchema);
const Invoice = InvoiceFactory(InvoiceBase, InvoiceSchema);
const Job = JobFactory(JobBase, JobSchema);

const models = Object.freeze({
  Collaborator,
  Client,
  Company,
  Project,
  Shoot,
  Deliverable,
  Invoice,
  Job,
  Asset,
  Cut
});

const asset = new Asset({});

const legacy_models = Object.freeze({
  'COLLABORATOR': Collaborator,
  'CLIENT': Client,
  'COMPANY': Company,
  'PROJECT': Project,
  'SHOOT': Shoot,
  'DELIVERABLE': Deliverable,
  'INVOICE': Invoice,
  'CUT': Cut
});

Object.keys(models).forEach((key) => {
  let model = models[key];
  model.model_name = key;
  // enableBasePublications(model);
  enableCrud(model);
});

// dependency injection solved by pulling this out into another object?
Object.keys(models).forEach((i) => {
  let model = models[i];
  model.models = models;
})

const Models = {
  allModels: Object.values(models),
  ...models,
  ...legacy_models,
  getRecordFromId: function(type, id) {
    const model = models[type];
    return model.fromId(id);
  }
}

export default Models;
