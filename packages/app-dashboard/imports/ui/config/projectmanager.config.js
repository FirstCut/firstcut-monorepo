import Tabs from '../components/routing/tabs';
import { Record, List } from 'immutable';
import { generatePermissions, generateActions } from './permissions';
import Routes from '../components/routing/routes';
import { UNIVERSAL_PERMISSIONS } from './config.enum';
import Models from '/imports/api/models';

const universalActions = {
  [Models.Deliverable.modelName]: new List(['deliverable_kickoff']),
  [Models.Project.modelName]: new List(['project_request_submission', 'project_wrap', 'project_preproduction_kickoff', 'notify_client_of_messages']),
  [Models.Shoot.modelName]: new List(['invite_to_edit_script', 'generate_booking_invoices', 'preproduction_kickoff', 'footage_verified']),
  [Models.Client.modelName]: new List(['send_invite_link']),
  [Models.Cut.modelName]: new List(['send_cut_to_client', 'cut_approved_by_client', 'revisions_sent']),
  [Models.Invoice.modelName]: new List(['invoice_paid']),
};

export const VideoProjectManagerConfig = new Record({
  subscriptions: new List(['records.all']),
  userExperience: 'PROJECT_MANAGER',
  manualActionsAvailable: new List([UNIVERSAL_PERMISSIONS]),
  visibleEvents: new List([UNIVERSAL_PERMISSIONS]),
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
    Routes.InvoiceInfo,
  ]),
  hasPermission: generatePermissions({ all: true }),
  getActions: generateActions(universalActions),
})();

export const SuperuserConfig = VideoProjectManagerConfig;

// export const SuperuserConfig = new Record({
//   tabs: new List(Object.values(Tabs.toObject())),
//   subscriptions: new List(['records.all']),
//   routes: new List(Object.values(Routes.toObject())),
//   userExperience: 'INTERNAL',
//   manualActionsAvailable: new List([UNIVERSAL_PERMISSIONS]),
//   homePage: '/projects',
//   hasPermission: generatePermissions({all: true}),
//   getActions: generateActions(universalActions)
// })();
