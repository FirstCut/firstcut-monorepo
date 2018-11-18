
import React from 'react';
import PropTypes from 'prop-types';

import {
  Image, List, Grid, Button, Header, Segment,
} from 'semantic-ui-react';
import { getRecordPath } from 'firstcut-retrieve-url';
import InfoPage from '../../pages/info.page';
import { ProfileItem } from './utils/profile.card';

export function CollaboratorInfoPage(props) {
  const { record } = props;
  return (
    <InfoPage
      record={record}
      sections={[
        getCollaboratorInfo(props),
      ]}
    />
  );
}

export function getCollaboratorInfo(props) {
  const { record } = props;
  return {
    title: record.modelName,
    record,
    subsections: [
      _basicInfo(props),
      _applicationInfo(props),
      paymentMethods(props),
      _skills(props),
    ],
  };
}

function _basicInfo(props) {
  const { record } = props;
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
      content: record.locationDisplayName,
    }],
  };
  const body = (<ProfileItem profile={profile} />);
  return { subtitle: '', body };
}

function _applicationInfo(props) {
  const { record } = props;
  const body = (
    <List>
      {record.portfolioUrl
        && (
        <List.Item>
          <b>
            Portfolio
          </b>
          <a target="_blank" href={record.portfolioUrl}>
            {record.portfolioUrl}
          </a>
        </List.Item>
        )
        }
      {record.applicationNotes
        && (
        <List.Item>
          <Segment>
            <Header>
              About
            </Header>
            <p>
              {record.applicationNotes}
            </p>
          </Segment>
        </List.Item>
        )
      }
    </List>
  );
  return { subtitle: '', body };
}


function _skills(props) {
  const { record } = { ...props };
  const body = record.skills.map((m) => {
    const qualified = (m.isQualified) ? 'Verified' : 'Verification pending';
    return (
      <List key={m.toString()}>
        <Header>
          {record.getSkillLabel(m.type)}
          {' '}
--
          {' '}
          {qualified}
        </Header>
      </List>
    );
  });

  return { subtitle: 'Skills', body };
}

export function paymentMethods(props) {
  const { record } = { ...props };
  const body = record.paymentMethod.map(m => (
    <List>
      <Header>
        {m.type}
      </Header>
      <List.Item>
        <List.Content>
          <b>
            Account Email
          </b>
          {' '}
          {m.accountEmail}
        </List.Content>
      </List.Item>
    </List>
  ));

  return { subtitle: '', body };
}
