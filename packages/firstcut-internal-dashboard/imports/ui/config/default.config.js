import Routes from '../components/routing/routes.jsx';
import {Record, List} from 'immutable';
import {generatePermissions, generateActions} from './permissions.js';
import {UNIVERSAL_PERMISSIONS} from './config.enum.js';

const DefaultConfig = new Record({
  tabs: new List([]),
  subscriptions: new List(['players.all', 'clients.all']),
  userExperience: 'CLIENT',
  routes: new List([Routes.PlayerPermissionsRequired, Routes.CutInfo]),
  homePage: '/permissionrequired',
  hasPermission: generatePermissions({'READ': [UNIVERSAL_PERMISSIONS]}),
  manualActionsAvailable: new List([]),
  getActions: generateActions({})
})();

export const PublicConfig = new Record({
  subscriptions: new List(['clients.all', 'players.all', 'public.all']),
  userExperience: 'PUBLIC',
  tabs: new List([]),
  homePage: '/login',
  routes: new List([Routes.ViewCut]),
  hasPermission: generatePermissions({'READ': [UNIVERSAL_PERMISSIONS]}),
  getActions: generateActions({})
})();

export default DefaultConfig;
