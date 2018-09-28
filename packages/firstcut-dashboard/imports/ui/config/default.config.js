import { Record, List } from 'immutable';
import Routes from '../components/routing/routes';
import { generatePermissions, generateActions } from './permissions';
import { UNIVERSAL_PERMISSIONS } from './config.enum';
import { userPlayerId } from 'firstcut-players';
import Models from 'firstcut-models';

const DefaultConfig = new Record({
  tabs: new List([]),
  subscriptions: new List(['players.public', 'clients.public']),
  userExperience: 'CLIENT',
  routes: new List([
    Routes.PlayerPermissionsRequired,
    Routes.CollaboratorInfo,
    Routes.ClientInfo,
    Routes.CutInfo,
    Routes.ApplyToBeAVideographer,
  ]),
  homePage: () => `/clients/${userPlayerId()}`,
  hasPermission: generatePermissions({ READ: [UNIVERSAL_PERMISSIONS] }),
  manualActionsAvailable: new List([]),
  getActions: generateActions({}),
})();

export const PublicConfig = new Record({
  subscriptions: new List(['public.all']),
  userExperience: 'PUBLIC',
  tabs: new List([]),
  homePage: '/login',
  routes: new List([Routes.CutInfo]),
  hasPermission: generatePermissions({ READ: [UNIVERSAL_PERMISSIONS] }),
  getActions: generateActions({
    [Models.Cut.modelName]: new List(['edit_feedback']),
  }),
})();

export default DefaultConfig;
