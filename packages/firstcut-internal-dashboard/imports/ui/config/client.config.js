import Routes from '../components/routing/routes.jsx';
import {Record, List} from 'immutable';
import {generateActions} from './permissions.js';

const ClientConfig = new Record({
  tabs: new List([]),
  subscriptions: new List(['client.all']),
  manualActionsAvailable: new List(['request_snippet']),
  routes: new List([Routes.ShootInfo, Routes.CutInfo, Routes.ViewCut, Routes.ClientInfo]),
  // getActions: generateActions({}),
  userExperience: 'CLIENT',
  hasPermission: function(action) {
    return false;
  },
})();

export default ClientConfig;
