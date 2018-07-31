import Tabs from '../components/routing/tabs.jsx';
import {Record, List} from 'immutable';
import {generatePermissions, generateActions} from './permissions.js';
import Routes from '../components/routing/routes.jsx';
import {UNIVERSAL_PERMISSIONS} from './config.enum.js';
import {Models} from 'firstcut-models';

const universal_actions = {
  [Models.Deliverable.model_name]: new List(['deliverable_kickoff']),
  [Models.Project.model_name]: new List(['project_wrap']),
  [Models.Shoot.model_name]: new List(['preproduction_kickoff', 'footage_verified']),
  [Models.Client.model_name]: new List(['send_invite_link']),
  [Models.Cut.model_name]: new List(['send_cut_to_client', 'cut_approved_by_client', 'revisions_sent']),
  [Models.Invoice.model_name]: new List(['invoice_paid']),
}

export const VideoProjectManagerConfig = new Record({
  subscriptions: new List(['records.all']),
  userExperience: 'INTERNAL',
  manualActionsAvailable: new List([UNIVERSAL_PERMISSIONS]),
  homePage: '/projects',
  tabs: new List([
    Tabs.ProjectList,
    Tabs.ShootList,
    Tabs.DeliverableList,
    Tabs.CutList,
    Tabs.CompanyList,
    Tabs.ClientList,
    Tabs.CollaboratorList,
    Tabs.InvoiceList,
  ]),
  routes: new List([
    Routes.ProjectList,
    Routes.ProjectInfo,
    Routes.ShootList,
    Routes.ShootInfo,
    Routes.DeliverableList,
    Routes.DeliverableInfo,
    Routes.CutList,
    Routes.CutInfo,
    Routes.CompanyList,
    Routes.CompanyInfo,
    Routes.ClientList,
    Routes.ClientInfo,
    Routes.CollaboratorList,
    Routes.CollaboratorInfo,
    Routes.InvoiceList,
    Routes.InvoiceInfo
  ]),
  hasPermission: generatePermissions({all: true}),
  getActions: generateActions(universal_actions)
})();

export const SuperuserConfig = new Record({
  tabs: new List(Object.values(Tabs.toObject())),
  subscriptions: new List(['records.all']),
  routes: new List(Object.values(Routes.toObject())),
  userExperience: 'INTERNAL',
  manualActionsAvailable: new List([UNIVERSAL_PERMISSIONS]),
  homePage: '/projects',
  hasPermission: generatePermissions({all: true}),
  getActions: generateActions(universal_actions)
})();
