import Tabs from '../components/routing/tabs';
import Routes from '../components/routing/routes';
import { Record, List } from 'immutable';
import { generatePermissions, generateActions } from './permissions';
import { UNIVERSAL_PERMISSIONS } from './config.enum';
import Models from 'firstcut-models';

const VideographerConfig = new Record({
  tabs: new List([Tabs.ShootList, Tabs.InvoiceList]),
  userExperience: 'VIDEOGRAPHER',
  manualActionsAvailable: new List([]),
  homePage: '/shoots',
  subscriptions: new List(['videographer.all']),
  routes: new List([
    Routes.ShootList,
    Routes.ShootInfo,
    Routes.InvoiceList,
    Routes.InvoiceInfo,
    Routes.CollaboratorInfo,
  ]),
  hasPermission: generatePermissions({
    READ: [UNIVERSAL_PERMISSIONS],
  }),
  getActions: generateActions({
    [Models.Shoot.modelName]: new List(['confirm_footage_uploaded']),
  }),
})();

export default VideographerConfig;
