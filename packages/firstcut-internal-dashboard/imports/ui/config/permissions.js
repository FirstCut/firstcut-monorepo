
import {UNIVERSAL_PERMISSIONS} from './config.enum.js';
import {List} from 'immutable';
import SimpleSchema from 'simpl-schema';

export function generatePermissions(permissions) {
  return (action) => {
    new SimpleSchema({
      verb: {
        type: String,
        allowedValues: ['WRITE', 'READ']
      },
      target: String
    });

    if (permissions.all) {
      return permissions.all;
    }
    const permission = permissions[action.verb];
    if (!permission) {
      return false;
    } else {
      return permission.includes(UNIVERSAL_PERMISSIONS) || permission.includes(action.target);
    }
  }
}

export function generateActions(actions) {
  return (record) => {
    return actions[record.model_name] || new List([]);
  }
}
