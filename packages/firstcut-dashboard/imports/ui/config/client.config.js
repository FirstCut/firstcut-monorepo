
import { Record, List } from 'immutable';
import Routes from '../components/routing/routes';
import Tabs from '../components/routing/tabs';
import Models from 'firstcut-models';
import { generateActions } from './permissions';

const ClientConfig = new Record({
  tabs: new List([Tabs.ProjectList]),
  subscriptions: new List(['client.all', 'assets.all']),
  manualActionsAvailable: new List(['request_snippet']),
  routes: new List([
    Routes.ProjectList,
    Routes.ProjectInfo,
    Routes.ShootInfo,
    Routes.CutInfo,
    Routes.ViewCut,
    Routes.ClientInfo,
  ]),
  visibleEvents: new List([
    'deliverable_kickoff',
    'cut_approved_by_client',
    'send_invite_link',
    'preproduction_kickoff',
    'project_wrap',
    'shoot_wrap',
    'send_cut_to_client',
    'cut_uploaded',
    'request_snippet',
    'project_handoff',
  ]),
  homePage: '/projects',
  userExperience: 'CLIENT',
  hasPermission: () => false,
  getActions: generateActions({
    [Models.Shoot.modelName]: new List(['edit_shoot_script']),
  }),
})();

export default ClientConfig;
