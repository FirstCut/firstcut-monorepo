import React from 'react';
import PropTypes from 'prop-types';
import {Route, Redirect} from 'react-router-dom';
import {Record} from 'immutable';
import {Models} from 'firstcut-models';
import {userHasAccess, isPublicAccess, userHomePage} from '/imports/ui/config';
import {PublicCutViewPage} from '../../pages/cut.view.jsx';
import LoginPage from '../../pages/login.page.jsx';
import {getBasepath} from 'firstcut-retrieve-url';
import {userPlayer} from 'firstcut-utils';

import ProjectsListPage from '../../pages/list-view/projects.list.jsx';
import ClientsListPage from '../../pages/list-view/clients.list.jsx';
import CompaniesListPage from '../../pages/list-view/companies.list.jsx';
import ShootsListPage from '../../pages/list-view/shoots.list.jsx';
import {DeliverablesTablePage} from '../../pages/list-view/deliverables.list.jsx';
import CutsListPage from '../../pages/list-view/cuts.list.jsx';
import CollaboratorsListPage from '../../pages/list-view/collaborators.list.jsx';
import InvoicesListPage from '../../pages/list-view/invoices.list.jsx';

import {ProjectInfoPage} from '../../components/info-view/project.info.jsx';
import {ClientInfoPage} from '../../components/info-view/client.info.jsx';
import {CollaboratorInfoPage} from '../../components/info-view/collaborator.info.jsx';
import {CompanyInfoPage} from '../../components/info-view/company.info.jsx';
import {DeliverableInfoPage} from '../../components/info-view/deliverable.info.jsx';
import {CutInfoPage} from '../../components/info-view/cut.info.jsx';
import {ShootInfoPage} from '../../components/info-view/shoot';
import {InvoiceInfoPage} from '../../components/info-view/invoice.info.jsx';
import PlayerPermissionsRequired from '../../pages/player-required.page.jsx';

import {_} from 'lodash';
import withRecord from '../../containers/record.container.jsx';
import withEditRecordModal from '../../containers/editrecord.container.jsx';

const {
  Project,
  Client,
  Collaborator,
  Deliverable,
  Cut,
  Shoot,
  Company,
  Invoice
} = Models;

const Routes = new Record({
  // Login: {route: Login, name: 'Login'},
  ViewCut: {
    route: ViewCut,
    name: 'ViewCut'
  },
  ProjectInfo: {
    route: asInfoPageRoute(ProjectInfoPage, Project, 'ProjectInfo'),
    name: 'ProjectInfo'
  },
  ClientInfo: {
    route: asInfoPageRoute(ClientInfoPage, Client, 'ClientInfo'),
    name: 'ClientInfo'
  },
  CollaboratorInfo: {
    route: asInfoPageRoute(CollaboratorInfoPage, Collaborator, 'CollaboratorInfo'),
    name: 'CollaboratorInfo'
  },
  CompanyInfo: {
    route: asInfoPageRoute(CompanyInfoPage, Company, 'CompanyInfo'),
    name: 'CompanyInfo'
  },
  InvoiceInfo: {
    route: asInfoPageRoute(InvoiceInfoPage, Invoice, 'InvoiceInfo'),
    name: 'InvoiceInfo'
  },
  CutInfo: {
    route: asInfoPageRoute(CutInfoPage, Cut, 'CutInfo'),
    name: 'CutInfo'
  },
  DeliverableInfo: {
    route: asInfoPageRoute(DeliverableInfoPage, Deliverable, 'DeliverableInfo'),
    name: 'DeliverableInfo'
  },
  ShootInfo: {
    route: asInfoPageRoute(ShootInfoPage, Shoot, 'ShootInfo'),
    name: 'ShootInfo'
  },
  ProjectList: {
    route: asListPageRoute(ProjectsListPage, Project, 'ProjectList'),
    name: 'ProjectList'
  },
  ClientList: {
    route: asListPageRoute(ClientsListPage, Client, 'ClientList'),
    name: 'ClientList'
  },
  CollaboratorList: {
    route: asListPageRoute(CollaboratorsListPage, Collaborator, 'CollaboratorList'),
    name: 'CollaboratorList'
  },
  CompanyList: {
    route: asListPageRoute(CompaniesListPage, Company, 'CompanyList'),
    name: 'CompanyList'
  },
  ShootList: {
    route: asListPageRoute(ShootsListPage, Shoot, 'ShootList'),
    name: 'ShootList'
  },
  InvoiceList: {
    route: asListPageRoute(InvoicesListPage, Invoice, 'InvoiceList'),
    name: 'InvoiceList'
  },
  CutList: {
    route: asListPageRoute(CutsListPage, Cut, 'CutList'),
    name: 'CutList'
  },
  DeliverableList: {
    route: asListPageRoute(DeliverablesTablePage, Deliverable, 'DeliverableList'),
    name: 'DeliverableList'
  },
  PlayerPermissionsRequired: {
    route: PlayerPermissionsRequiredRoute,
    name: 'PlayerPermissionsRequired'
  },
  Login: {
    route: Login,
    name: 'Login'
  },
  Home: {
    route: Home,
    name: 'Home'
  }
})();

function asListPageRoute(Page, model, name) {
  return function ListPageComponent(props) {
    const basepath = getBasepath(model);
    const RouteComponent = (isPublicAccess(name))
      ? Route
      : PrivateRoute;
    return (
      <RouteComponent exact name={name} path={basepath} render={(props) => {
        return <Page model={model} {...props}/>
      }}/>
    );
  }
}

function asInfoPageRoute(Component, model, name) {
  return function InfoPageComponent(props) {
    const basepath = getBasepath(model);
    const RouteComponent = (isPublicAccess(name))
      ? Route
      : PrivateRoute;
    return (
      <RouteComponent path={`${basepath}/:_id`} name={name} render={(props) => {
        const _id = props.match.params._id;
        const Page = _.flowRight(withRecord)(Component);
        return <Page _id={_id} model={model} {...props}/>;
      }}/>
    )
  }
}

function ViewCut(props) {
  return (
    <Route path='/view_cut/:_id' name={Routes.ViewCut.name} render={(props) => {
      const _id = props.match.params._id;
      const View = withRecord(PublicCutViewPage);
      return <View model={Cut} _id={_id}/>
    }}/>
  )
}

function Login() {
  if (Meteor.user()) {
    const home = userHomePage();
    return <Route path='/login' render={(props) => <Redirect to={home} {...props}/>}/>;
  }
  return <Route exact path='/login' component={LoginPage}/>;
}

function Home() {
  const home_page_path = userHomePage();
  return <Route exact path='/' render={(props) => <Redirect to={home_page_path}/>}/>;
}

function PlayerPermissionsRequiredRoute(props) {
  // if (!Meteor.user()) {
  //   return <Route path='/permissionrequired' render={(props) => <Redirect to='/login' {...props}/>}/>;
  // }
  return <Route path='/permissionrequired' name={Routes.PlayerPermissionsRequired.name} component={PlayerPermissionsRequired}/>;
}

function PrivateRoute(props) {
  if (!Meteor.user()) {
    return <Route {...props} render={(props)=> <LoginPage {...props}/>}/>
  } else if (!userPlayer() || !userHasAccess(props.name)) {
    return <Route {...props} render={(props)=> <PlayerPermissionsRequired {...props}/>}/>
  // } else if (!userHasAccess(props.name)) {
  //   const home_page_path = userHomePage();
  //   return <Route {...props} render={(props)=> <Redirect to={home_page_path} {...props}/> }/>;
  }
  return <Route {...props} />
}

export default Routes;
