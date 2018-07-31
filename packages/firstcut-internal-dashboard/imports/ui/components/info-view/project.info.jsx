import React from 'react';
import {Item} from 'semantic-ui-react';

import InfoPage from '../../pages/info.page.jsx';
import {FilePortal, FileView} from '../utils/file.portal.jsx';
import {getClientInfo} from './client.info.jsx';
import {getCompanyInfo} from './company.info.jsx';
import {getDeliverableInfo} from './deliverable.info.jsx';
import {getShootInfo} from './shoot/shoot.info.jsx';
import {isEmpty} from 'firstcut-utils';
import {getRecordPath} from 'firstcut-retrieve-url';
import {InfoPageProps} from './utils/shared.props.jsx';
import {userPlayerId} from 'firstcut-utils';

export function ProjectInfoPage(props) {
  const {record} = props;
  let sections = [getProjectInfo(props)];

  if (record.company) {
    sections.push(getCompanyInfo({record: record.company}));
  }

  if (record.clientOwner) {
    sections.push(getClientInfo({record: record.clientOwner}));
  }
  if (!isEmpty(record.deliverables)) {
    const deliverable_sections = record.deliverables.map(d => {
      return getDeliverableInfo({record: d})
    });
    sections = [
      ...sections,
      ...deliverable_sections
    ];
  }
  if (!isEmpty(record.shoots)) {
    const shoot_sections = record.shoots.map(s => {
      return getShootInfo({record: s})
    });
    sections = [
      ...sections,
      ...shoot_sections
    ];
  }

  return (
    <InfoPage
    sections={sections}
    record={record}
    />)
}

ProjectInfoPage.propTypes = InfoPageProps;

export function getProjectInfo(props) {
  const {record} = props;
  const subsections = [_basicInfo(props)];
  if (!isEmpty(record.assets)) {
    subsections.push(_assets(props));
  }
  return {title: record.model_name, record: record, subsections: subsections};
}

function _basicInfo(props) {
  const {record} = props;
  const body = (
    <Item>
      <Item.Content>
        <Item.Header>
          <b>{record.getFieldLabel('name')} </b>
          {record.displayName}</Item.Header>
        <Item.Header>
          <b>{record.getFieldLabel('blueprint')} </b>
          {record.blueprintLabel}</Item.Header>
        <Item.Header>
          <b>{record.getFieldLabel('stage')} </b>
          {record.stageLabel}</Item.Header>
        <Item.Header>
          <b>{record.getFieldLabel('adminOwnerId')} </b>
          <a href={getRecordPath(record.adminOwner)}>{record.adminOwnerDisplayName}</a>
        </Item.Header>
      </Item.Content>
    </Item>
  );
  return {subtitle: '', body};
}

function _assets(props) {
  const {record} = props;
  const body = (<FilePortal record={record} fieldname='assets' view={FileView}/>)
  return {subtitle: 'Assets', body}
}
