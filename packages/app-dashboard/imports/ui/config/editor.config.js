import { Record, List } from 'immutable';
import Tabs from '../components/routing/tabs';
import Routes from '../components/routing/routes';
import Models from '/imports/api/models';
import { generatePermissions, generateActions } from './permissions';
import { UNIVERSAL_PERMISSIONS } from './config.enum';

const VideoEditorConfig = new Record({
  subscriptions: new List(['editor.all']),
  tabs: new List([
    Tabs.ProjectList,
    Tabs.DeliverableList,
    Tabs.CutList,
    Tabs.InvoiceList,
  ]),
  userExperience: 'EDITOR',
  manualActionsAvailable: new List([]),
  homePage: '/cuts',
  routes: new List([
    Routes.ProjectList,
    Routes.ProjectInfo,
    Routes.CompanyInfo,
    Routes.DeliverableList,
    Routes.DeliverableInfo,
    Routes.CollaboratorInfo,
    Routes.CutList,
    Routes.CutInfo,
    Routes.InvoiceList,
    Routes.InvoiceInfo,
  ]),
  hasPermission: generatePermissions({
    READ: [UNIVERSAL_PERMISSIONS],
    CREATE: [Models.Cut.modelName, Models.Task.modelName],
    WRITE: [Models.Cut.modelName, Models.Deliverable.modelName, Models.Project.modelName],
  }),
  getActions: generateActions({}),
})();

export default VideoEditorConfig;
