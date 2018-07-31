import React from 'react';
import {Link} from 'react-router-dom';
import {Menu} from 'semantic-ui-react'
import {getBasepath} from 'firstcut-retrieve-url';
import {Models} from 'firstcut-models';
import {Record} from 'immutable';

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

const Tabs = new Record({
  ProjectList: {
    component: listTabFromModel(Project),
    name: Project.model_name,
    order: 0
  },
  ClientList: {
    component: listTabFromModel(Client),
    name: Client.model_name,
    order: 1
  },
  ShootList: {
    component: listTabFromModel(Shoot),
    name: Shoot.model_name,
    order: 2
  },
  DeliverableList: {
    component: listTabFromModel(Deliverable),
    name: Deliverable.model_name,
    order: 3
  },
  CutList: {
    component: listTabFromModel(Cut),
    name: Cut.model_name,
    order: 4
  },
  CompanyList: {
    component: listTabFromModel(Company),
    name: Company.model_name,
    order: 5
  },
  CollaboratorList: {
    component: listTabFromModel(Collaborator),
    name: Collaborator.model_name,
    order: 6
  },
  InvoiceList: {
    component: listTabFromModel(Invoice),
    name: Invoice.model_name,
    order: 7
  },
  // Logout: {
  //   component: LogoutTab,
  //   name: "Logout",
  //   order: 100
  // },
})();

// export const Login = {
//   component: LoginTab,
//   name: "Login",
//   order: 100
// }
//
function listTabFromModel(model) {
  return function Component(props) {
    const {active_item, onClick} = props;
    const name = model.model_name;
    return (
      <Menu.Item as={Link} to={getBasepath(model)} active={active_item == name} onClick={onClick(name)}>
        {name}
      </Menu.Item>
    )
  }
}

export function LogoutTab(props) {
  return (
    <Menu.Item className='right aligned' onClick={() => Meteor.logout()}>
      Logout
    </Menu.Item>
  )
}

export function LoginTab(props) {
  return (
    <Menu.Item className='right aligned' as={Link} to='/login'>
      Login
    </Menu.Item>
  )
}

export default Tabs;
