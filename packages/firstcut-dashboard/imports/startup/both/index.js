
import 'firstcut-models';
// import 'firstcut-calendar';
import 'firstcut-google-api';

Meteor.startup(() => {
  // /I KNOW THIS IS SKETCHY BUT IT IS SO CONVENIENT I PROMISE I WILL CHANGE
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
