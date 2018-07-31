import Tabs from '../components/routing/tabs.jsx';
import Routes from '../components/routing/routes.jsx';
import {Record, List} from 'immutable';
import {generatePermissions, generateActions} from './permissions.js';
import {UNIVERSAL_PERMISSIONS} from './config.enum.js';
import {Models} from 'firstcut-models';
//
const VideographerConfig = new Record({
  tabs: new List([Tabs.ShootList, Tabs.InvoiceList]),
  userExperience: 'VIDEOGRAPHER',
  manualActionsAvailable: new List([]),
  homePage: '/shoots',
  subscriptions: new List(['videographer.all']),
  routes: new List(Object.values(Routes.toObject())),
  hasPermission: generatePermissions({'READ': [UNIVERSAL_PERMISSIONS]}),
  getActions: generateActions({
    [Models.Shoot.model_name]: new List(['confirm_footage_uploaded'])
  })
})();

export default VideographerConfig;
