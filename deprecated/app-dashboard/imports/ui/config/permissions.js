
import { List } from 'immutable';
import SimpleSchema from 'simpl-schema';
import { UNIVERSAL_PERMISSIONS } from './config.enum';

export function generatePermissions(permissions) {
  return (action) => {
    if (permissions.all) {
      return permissions.all;
    }
    const permission = permissions[action.verb];
    if (!permission) {
      return false;
    }
    return permission.includes(UNIVERSAL_PERMISSIONS) || permission.includes(action.target);
  };
}

export function generateActions(actions) {
  return record => actions[record.modelName] || new List([]);
}
