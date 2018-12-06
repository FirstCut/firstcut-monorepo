import React from 'react';
import PropTypes from 'prop-types';
import {
  Header, List, Segment, Card, Container,
} from 'semantic-ui-react';
import { Record } from 'immutable';

import InfoPage from '../../pages/info.page';
import { FilePortal, FileView } from '../utils/file.portal';
import { getCompanyInfo } from './company.info';
import { getCutInfo } from './cut.info';
import { isEmpty } from 'firstcut-utils';
import { getRecordPath } from 'firstcut-retrieve-url';
import { asLinkToRecord } from '../utils/utils';
import { HumanReadableDate } from '/imports/ui/components/utils/dates';

export function DeliverableInfoPage(props) {
  const { record } = props;
  let sections = [getDeliverableInfo(props)];

  if (record.company) {
    sections.push(getCompanyInfo({ record: record.company }));
  }

  if (!isEmpty(record.getCuts())) {
    const latest = record.getLatestCut();
    const cutInfo = getCutInfo({ record: latest });
    sections = [
      ...sections,
      cutInfo,
    ];
  }

  return (
    <InfoPage
      sections={sections}
      record={record}
      {...props}
    />
  );
}

DeliverableInfoPage.propTypes = {
  record: PropTypes.instanceOf(Record).isRequired,
};

export function getDeliverableInfo(props) {
  const { record } = props;
  const subsections = [_basicInfo(props), _songs(props)];
  if (!isEmpty(record.assets)) {
    subsections.push(_assets(props));
  }
  return { title: `${record.modelName} - ${record.displayName}`, record, subsections };
}

function _basicInfo(props) {
  const { record } = props;
  const body = (
    <List>
      <Header>
        {record.displayName}
      </Header>
      { record.approvedCut()
        && (
        <List.Item>
          <List.Content>
            <b>
            Approved Cut
              {' '}
            </b>
            <a href={getRecordPath(record.approvedCut())}>
              {record.approvedCut().displayName}
            </a>
          </List.Content>
        </List.Item>
        )
      }
      <List.Item>
        <List.Content>
          <b>
            {record.getFieldLabel('blueprint')}
            {' '}
          </b>
          {record.blueprintLabel}
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <b>
            {record.getFieldLabel('projectId')}
            {' '}
          </b>
          <a href={getRecordPath(record.project)}>
            {record.projectDisplayName}
          </a>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <b>
            {record.getFieldLabel('clientOwnerId')}
            {' '}
          </b>
          <a href={getRecordPath(record.clientOwner)}>
            {record.clientOwnerDisplayName}
          </a>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <b>
          Admin Owner:
            {' '}
          </b>
          <a href={getRecordPath(record.adminOwner)}>
            {record.adminOwnerDisplayName}
          </a>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <b>
            {record.getFieldLabel('postpoOwnerId')}
            {' '}
          </b>
          <a href={getRecordPath(record.postpoOwner)}>
            {record.postpoOwnerDisplayName}
          </a>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <b>
            {record.getFieldLabel('estimatedDuration')}
            {' '}
          </b>
          {record.estimatedDuration}
        </List.Content>
      </List.Item>
      <List.Item>
        <Segment>
          <Header>
            {record.getFieldLabel('adminNotes')}
          </Header>
          <p>
            {record.adminNotes}
          </p>
        </Segment>
      </List.Item>
      <List.Item>
        <Segment>
          <Header>
            {record.getFieldLabel('title')}
          </Header>
          <p>
            {record.title}
          </p>
        </Segment>
      </List.Item>
      <List.Item>
        <Segment>
          <Header>
            {record.getFieldLabel('cta')}
          </Header>
          <p>
            {record.cta}
          </p>
        </Segment>
      </List.Item>
    </List>
  );

  return { subtitle: '', body };
}

function _assets(props) {
  const { record } = props;
  const body = (<FilePortal record={record} fieldname="assets" view={FileView} />);
  return { subtitle: 'Asset', body };
}

function _songs(props) {
  const { record } = props;
  const body = record.songs.map((s) => {
    const song = {
      name: s.name,
      url: s.url,
      approved: s.approved,
    };
    return (
      <a target="_blank" key={s.name} href={song.url}>
        {song.name}
        {' '}
        { song.approved && <span> -- APPROVED!! </span>}
      </a>
    );
  });
  return { subtitle: 'Songs', body };
}