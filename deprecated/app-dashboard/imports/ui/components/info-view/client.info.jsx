import React from 'react';
import PropTypes from 'prop-types';

import { Container, Header } from 'semantic-ui-react';
import { ProfileItem } from './utils/profile.card';
import InfoPage from '../../pages/info.page';
import { userExperience } from '/imports/ui/config';

export function ClientInfoPage(props) {
  if (userExperience().isClient) {
    return <ClientExternalInfoPage {...props} />;
  }
  return <ClientInternalInfoPage {...props} />;
}

function ClientExternalInfoPage(props) {
  const body = _basicInfo(props).body;
  return (
    <Container {...props}>
      {body}
    </Container>
  );
}

function ClientInternalInfoPage(props) {
  const { record } = props;
  return (<InfoPage record={record} sections={[getClientInfo(props)]} />);
}

export function getClientInfo(props) {
  const { record } = props;
  return {
    title: record.modelName,
    record,
    subsections: [_basicInfo(props)],
  };
}

function _basicInfo(props) {
  const { record } = props;
  const profile = {
    fullName: record.fullName,
    subheader: record.companyDisplayName,
    profilePicture: record.profilePicture,
    items: [
      {
        icon: 'mail',
        content: record.email,
      }, {
        icon: 'phone',
        content: record.phone,
      }, {
        icon: 'marker',
        content: record.locationDisplayName,
      },
    ],
  };
  const body = (<ProfileItem profile={profile} />);
  return { subtitle: '', body };
}
