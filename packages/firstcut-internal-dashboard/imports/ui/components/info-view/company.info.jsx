
import React from 'react';
import PropTypes from 'prop-types';
import {List} from 'semantic-ui-react';

import InfoPage from '../../pages/info.page.jsx';
import { isEmpty } from 'firstcut-utils';
import { FilePortal, FileView } from '../utils/file.portal.jsx';

export function CompanyInfoPage(props) {
  const {record} = props;
  return (
    <InfoPage
      record={record}
      sections={[
        getCompanyInfo(props),
      ]}
    />
  )
}

export function getCompanyInfo(props) {
  const {record} = props;
  const subsections = [_basicInfo(props)];
  if(!isEmpty(record.branding)) {
    subsections.push(_branding(props));
  }
  if (record.hasBrandIntro) {
    subsections.push(_brandIntro(props));
  }
  return {
    title: record.model_name,
    record: record,
    subsections
  };
}

function _basicInfo(props) {
  const {record} = props;
  const body =(
          <List>
            <List.Item>
              <List.Icon name='building outline' />
              <List.Content>{record.displayName}</List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name='globe' />
              <List.Content>
              <a target="_blank" href={record.website}>{record.website}</a>
            </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name='marker' />
              <List.Content>{record.locationDisplayName}</List.Content>
            </List.Item>
          </List>
        )
  return {subtitle: '', body};
}

function _brandIntro(props) {
  const {record} = props;
  const body = (
    <FilePortal
      record={record}
      fieldname='brandIntroId'
      view={FileView}
    />
  )
  return {
    subtitle: 'Brand Intro',
    body
  }
}

function _branding(props) {
  const {record} = props;

  const body = (
    <FilePortal
      record={record}
      fieldname='branding'
      view={FileView}
    />
  )

  return {
    subtitle: 'Branding',
    body: body
  }
}
