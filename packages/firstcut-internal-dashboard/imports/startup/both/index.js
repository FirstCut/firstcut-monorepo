
import 'firstcut-models';

Meteor.startup(() => {
  // HACKy modifications to the array prototype to allow interacting with arrays in the
  // same way we interact with immutables
  // TODO: do less dangerous thing
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
