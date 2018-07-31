import Tabs from '../components/routing/tabs.jsx';
import Routes from '../components/routing/routes.jsx';
import {Record, List} from 'immutable';
import {Models} from 'firstcut-models';
import {generatePermissions, generateActions} from './permissions.js';
import {UNIVERSAL_PERMISSIONS} from './config.enum.js';

const VideoEditorConfig = new Record({
  subscriptions: new List(['editor.all']),
  tabs: new List([Tabs.ProjectList, Tabs.DeliverableList, Tabs.CutList, Tabs.InvoiceList]),
  userExperience: 'INTERNAL',
  manualActionsAvailable: new List([]),
  homePage: '/cuts',
  routes: new List([
    Routes.ProjectList,
    Routes.ProjectInfo,
    Routes.DeliverableList,
    Routes.DeliverableInfo,
    Routes.CutList,
    Routes.CutInfo,
    Routes.InvoiceList,
    Routes.InvoiceInfo
  ]),
  hasPermission: generatePermissions({
    'READ': [UNIVERSAL_PERMISSIONS],
    'WRITE': [Models.Cut.model_name]
  }),
  getActions: generateActions({})
})();

export default VideoEditorConfig;
