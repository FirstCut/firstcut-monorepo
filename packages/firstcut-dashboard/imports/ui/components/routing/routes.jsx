import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Record } from 'immutable';
import Models from 'firstcut-models';
import { userHasAccess, isPublicAccess, userHomePage } from '/imports/ui/config';
import { _ } from 'lodash';
import { PublicCutViewPage } from '../../pages/cut.view';
import LoginPage from '../../pages/login.page';
import ApplyToBeAVideographerPage from '../../pages/apply.page';
import { getBasepath } from 'firstcut-retrieve-url';
import { userPlayer } from 'firstcut-players';

import ProjectsListPage from '../../pages/list-view/projects.list';
import ClientsListPage from '../../pages/list-view/clients.list';
import CompaniesListPage from '../../pages/list-view/companies.list';
import ShootsListPage from '../../pages/list-view/shoots.list';
import { DeliverablesTablePage } from '../../pages/list-view/deliverables.list';
import CutsListPage from '../../pages/list-view/cuts.list';
import CollaboratorsListPage from '../../pages/list-view/collaborators.list';
import InvoicesListPage from '../../pages/list-view/invoices.list';

import PaymentForm from '../payments/pay';

import ProjectInfoPage from '../info-view/project';
import { ClientInfoPage } from '../info-view/client.info';
import { CollaboratorInfoPage } from '../info-view/collaborator.info';
import { CompanyInfoPage } from '../info-view/company.info';
import { DeliverableInfoPage } from '../info-view/deliverable.info';
import { CutInfoPage } from '../info-view/cut.info';
import ShootInfoPage from '../info-view/shoot';
import { InvoiceInfoPage } from '../info-view/invoice.info';
import PlayerPermissionsRequired from '../../pages/player-required.page';
import Analytics from '/imports/api/analytics';
import withRecord from '../../containers/record.container';

const {
  Project,
  Client,
  Collaborator,
  Deliverable,
  Cut,
  Shoot,
  Company,
  Invoice,
} = Models;

const Routes = new Record({
  // Login: {route: Login, name: 'Login'},
  ViewCut: {
    route: ViewCut,
    name: 'ViewCut',
  },
  PayInvoice: {
    route: PayInvoice,
    name: 'PayInvoice',
  },
  ProjectInfo: {
    route: asInfoPageRoute(ProjectInfoPage, Project, 'ProjectInfo'),
    name: 'ProjectInfo',
  },
  ClientInfo: {
    route: asInfoPageRoute(ClientInfoPage, Client, 'ClientInfo'),
    name: 'ClientInfo',
  },
  CollaboratorInfo: {
    route: asInfoPageRoute(CollaboratorInfoPage, Collaborator, 'CollaboratorInfo'),
    name: 'CollaboratorInfo',
  },
  CompanyInfo: {
    route: asInfoPageRoute(CompanyInfoPage, Company, 'CompanyInfo'),
    name: 'CompanyInfo',
  },
  InvoiceInfo: {
    route: asInfoPageRoute(InvoiceInfoPage, Invoice, 'InvoiceInfo'),
    name: 'InvoiceInfo',
  },
  CutInfo: {
    route: asInfoPageRoute(CutInfoPage, Cut, 'CutInfo'),
    name: 'CutInfo',
  },
  DeliverableInfo: {
    route: asInfoPageRoute(DeliverableInfoPage, Deliverable, 'DeliverableInfo'),
    name: 'DeliverableInfo',
  },
  ShootInfo: {
    route: asInfoPageRoute(ShootInfoPage, Shoot, 'ShootInfo'),
    name: 'ShootInfo',
  },
  ProjectList: {
    route: asListPageRoute(ProjectsListPage, Project, 'ProjectList'),
    name: 'ProjectList',
  },
  ClientList: {
    route: asListPageRoute(ClientsListPage, Client, 'ClientList'),
    name: 'ClientList',
  },
  CollaboratorList: {
    route: asListPageRoute(CollaboratorsListPage, Collaborator, 'CollaboratorList'),
    name: 'CollaboratorList',
  },
  CompanyList: {
    route: asListPageRoute(CompaniesListPage, Company, 'CompanyList'),
    name: 'CompanyList',
  },
  ShootList: {
    route: asListPageRoute(ShootsListPage, Shoot, 'ShootList'),
    name: 'ShootList',
  },
  InvoiceList: {
    route: asListPageRoute(InvoicesListPage, Invoice, 'InvoiceList'),
    name: 'InvoiceList',
  },
  CutList: {
    route: asListPageRoute(CutsListPage, Cut, 'CutList'),
    name: 'CutList',
  },
  DeliverableList: {
    route: asListPageRoute(DeliverablesTablePage, Deliverable, 'DeliverableList'),
    name: 'DeliverableList',
  },
  PlayerPermissionsRequired: {
    route: PlayerPermissionsRequiredRoute,
    name: 'PlayerPermissionsRequired',
  },
  Login: {
    route: Login,
    name: 'Login',
  },
  Home: {
    route: Home,
    name: 'Home',
  },
  ApplyToBeAVideographer: {
    route: applyToBeAVideographer,
    name: 'Apply',
  },
})();

function asListPageRoute(Page, model, name) {
  return function ListPageComponent(props) {
    const basepath = getBasepath(model);
    const RouteComponent = (isPublicAccess(name))
      ? Route
      : PrivateRoute;
    return (
      <RouteComponent
        exact
        name={name}
        path={basepath}
        render={(props) => {
          Analytics.trackNavigationEvent({ name: 'list', basepath, modelName: model.modelName });
          return (<Page model={model} {...props} />);
        }}
      />
    );
  };
}

function asInfoPageRoute(Component, model, name) {
  return function InfoPageComponent(props) {
    const basepath = getBasepath(model);
    const RouteComponent = (isPublicAccess(name))
      ? Route
      : PrivateRoute;
    return (
      <RouteComponent
        exact
        path={`${basepath}/:_id`}
        name={name}
        render={(props) => {
          const { _id } = props.match.params;
          Analytics.trackNavigationEvent({
            name: 'info',
            modelName: model.modelName,
            basepath,
            _id,
          });
          const Page = _.flowRight(withRecord)(Component);
          return <Page _id={_id} model={model} {...props} />;
        }}
      />
    );
  };
}

function PayInvoice(props) {
  return (
    <Route
      path="/pay"
      name={Routes.PayInvoice.name}
      render={(props) => {
        const { _id } = props.match.params;
        Analytics.trackNavigationEvent({ name: 'pay invoice', basepath: 'pay', _id });
        const View = withRecord(PaymentForm);
        return <View model={Invoice} _id={_id} />;
      }}
    />
  );
}


function ViewCut(props) {
  return (
    <Route
      path="/view_cut/:_id"
      name={Routes.ViewCut.name}
      render={(props) => {
        const { _id } = props.match.params;
        Analytics.trackNavigationEvent({ name: 'view public cut', basepath: 'view_cut', _id });
        const View = withRecord(PublicCutViewPage);
        return <View model={Cut} _id={_id} />;
      }}
    />
  );
}

function applyToBeAVideographer(props) {
  return <PrivateRoute exact path="/apply" name="Apply" {...props} component={ApplyToBeAVideographerPage} />;
}

function Login() {
  if (Meteor.user()) {
    const home = userHomePage();
    return <Route path="/login" render={props => <Redirect to={home} {...props} />} />;
  }
  Analytics.trackNavigationEvent({ name: 'login' });
  return <Route exact path="/login" component={LoginPage} />;
}

function Home() {
  const homePagePath = userHomePage();
  return <Route exact path="/" render={props => <Redirect to={homePagePath} />} />;
}

function PlayerPermissionsRequiredRoute(props) {
  const Component = (Meteor.user()) ? PlayerPermissionsRequired : LoginPage;
  return <Route exact path="/permissionrequired" name={Routes.PlayerPermissionsRequired.name} component={Component} />;
}

function PrivateRoute(props) {
  const { name } = props;
  if (!Meteor.user()) {
    const { component, ...rest } = props;
    return <Route {...rest} render={props => <LoginPage {...props} />} />;
  } if (!Meteor.settings.public.skillsOverride && (!userPlayer() || !userHasAccess(name))) {
    const homePagePath = userHomePage();
    return <Route {...props} render={props => <Redirect to={homePagePath} />} />;
  }
  return <Route {...props} />;
}

export default Routes;
