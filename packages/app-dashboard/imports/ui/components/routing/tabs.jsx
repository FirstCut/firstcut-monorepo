
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { getBasepath } from 'firstcut-retrieve-url';
import Models from '/imports/api/models';
import { Record } from 'immutable';
import { pluralize } from 'firstcut-utils';

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

const Tabs = new Record({
  ProjectList: {
    component: listTabFromModel(Project),
    order: 0,
  },
  ClientList: {
    component: listTabFromModel(Client),
    name: pluralize(Client.modelName),
    order: 1,
  },
  ShootList: {
    component: listTabFromModel(Shoot),
    name: pluralize(Shoot.modelName),
    order: 2,
  },
  DeliverableList: {
    component: listTabFromModel(Deliverable),
    name: pluralize(Deliverable.modelName),
    order: 3,
  },
  CutList: {
    component: listTabFromModel(Cut),
    name: pluralize(Cut.modelName),
    order: 4,
  },
  CompanyList: {
    component: listTabFromModel(Company),
    name: pluralize(Company.modelName),
    order: 5,
  },
  CollaboratorList: {
    component: listTabFromModel(Collaborator),
    name: pluralize(Collaborator.modelName),
    order: 6,
  },
  InvoiceList: {
    component: listTabFromModel(Invoice),
    name: pluralize(Invoice.modelName),
    order: 7,
  },
  // ViewAs: {
  //   component: ViewDashboardAs
  //   name: pluralize(Invoice.modelName),
  //   order: 7,
  // },
})();

function listTabFromModel(model) {
  return function Component(props) {
    const { activeItem, onClick } = props;
    const name = pluralize(model.modelName);
    return (
      <Menu.Item
        as={Link}
        to={getBasepath(model)}
        active={activeItem === name}
        onClick={onClick(name)}
        header
      >
        {name}
      </Menu.Item>
    );
  };
}

export function LogoutTab(props) {
  return (
    <Menu.Item className="right aligned" onClick={() => Meteor.logout()}>
      Logout
    </Menu.Item>
  );
}

export function LoginTab(props) {
  return (
    <Menu.Item className="right aligned" as={Link} to="/login">
      Login
    </Menu.Item>
  );
}

export default Tabs;
