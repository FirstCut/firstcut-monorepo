
// import 'firstcut-calendar';
import 'firstcut-blueprints';
import 'firstcut-actions';
import 'firstcut-action-utils';
import '/imports/api/player.api';
import '/imports/api/filestore';
import Models from '/imports/api/models';
import { initModelsForPipeline } from 'firstcut-pipeline-utils';
import { initApiMethods } from 'firstcut-google-api';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'lodash';
import SimpleSchema from 'simpl-schema';
import initPublications from './publications/publications';

import enableBasePublications from './publications/publications.base';


Meteor.startup(() => {
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

  initApiMethods();
  initModelsForPipeline(Models);

  if (Meteor.isServer) {
    initPublications(Models);
  }

  _.forEach(Models.allModels, (model) => {
    enableBasePublications(model);
  });
  // /I KNOW THIS IS SKETCHY BUT IT IS SO CONVENIENT I PROMISE I WILL CHANGE
  // .........
  // / I KNOW OK FINE I"LL CHANGE IT.... jeez
  // .............

  // this needs to be pulled out
  if (!Array.prototype.toJS) {
    Array.prototype.toJS = function () {
      return this;
    };
  }

  if (!Array.prototype.toArray) {
    Array.prototype.toArray = function () {
      return this;
    };
  }

  if (!Array.prototype.count) {
    Array.prototype.count = function () {
      return this.length;
    };
  }

  if (!Array.prototype.get) {
    Array.prototype.get = function (index) {
      return this[index];
    };
  }

  if (!Array.prototype.set) {
    Array.prototype.set = function (index, value) {
      this[index] = value;
      return this;
    };
  }
  if (!Array.prototype.size) {
    Array.prototype.size = function (index, value) {
      return this.length;
    };
  }
});
