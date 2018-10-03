
import { Random } from 'meteor-standalone-random';
import { initModels } from 'firstcut-models';
// import 'firstcut-calendar';
import 'firstcut-google-api';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Session } from 'meteor/session';

Meteor.startup(() => {
  initModels(ValidatedMethod);
  // /I KNOW THIS IS SKETCHY BUT IT IS SO CONVENIENT I PROMISE I WILL CHANGE
  // .........
  /// I KNOW OK FINE I"LL CHANGE IT.... jeez
  // .............
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
