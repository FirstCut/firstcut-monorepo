
import React from 'react';
import PropTypes from 'prop-types';

import { Image, List, Grid, Button, Header } from 'semantic-ui-react';
import InfoPage from '../../pages/info.page.jsx';
import { ProfileItem } from './utils/profile.card.jsx';
import { getRecordPath } from 'firstcut-retrieve-url';

export function CollaboratorInfoPage(props) {
  const {record} = props;
  return (
    <InfoPage
      record={record}
      sections={[
        getCollaboratorInfo(props),
      ]}/>
  )
}

export function getCollaboratorInfo(props) {
  const {record} = props;
  return {
    title: record.model_name,
    record,
    subsections: [
      _basicInfo(props),
      paymentMethods(props),
      _skills(props),
    ]
  };
}

function _basicInfo(props) {
  const {record} = props;
  const profile = {
    fullName: record.fullName,
    subheader: record.type,
    profilePicture: record.profilePicture,
    items: [{
      icon: 'mail',
      content: record.email,
    }, {
      icon: 'phone',
      content: record.phone,
    }, {
      icon: 'marker',
      content: record.locationDisplayName
    }]
  }
  const body = (<ProfileItem profile={profile} />)
  return { subtitle: '', body };
}

function _skills(props) {
  const {record} = {...props};
  const body = record.skills.map( m => {
    const qualified = (m.isQualified) ? 'Is Qualified' : 'Is NOT Qualified';
    return (
      <List>
        <Header>{m.type} -- {qualified}</Header>
      </List>
    )
  });

  return { subtitle: 'Skills', body };
}

export function paymentMethods(props) {
  const {record} = {...props};
  const body = record.paymentMethod.map( m => {
    return (
      <List>
        <Header>{m.type}</Header>
        <List.Item>
          <List.Content><b>Account Email</b> {m.accountEmail}</List.Content>
        </List.Item>
      </List>
    )
  });

  return { subtitle: '', body };
}
