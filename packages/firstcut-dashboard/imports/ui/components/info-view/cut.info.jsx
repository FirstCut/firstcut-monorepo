
import React from 'react';
import { Header, List, Segment } from 'semantic-ui-react';

import InfoPage from '../../pages/info.page';
import { FilePortal, FileView } from '../utils/file.portal';
import { FromNowDate } from '../utils/dates';
import { getRecordPath, getPublicCutViewLink } from 'firstcut-retrieve-url';
import { ClientCutViewPage, PublicCutViewPage } from '/imports/ui/pages/cut.view';
import { userExperience } from '/imports/ui/config';
import { NotFound } from '/imports/ui/pages/404';

export function CutInfoPage(props) {
  const { record } = props;
  console.log(record);
  const experience = userExperience();
  if (!record) {
    return <NotFound />;
  } if (experience.isClient || experience.isVideographer || experience.isPublic) {
    return <ClientCutViewPage {...props} />;
  } if (experience.isPublic) {
    return <PublicCutViewPage {...props} />;
  } if (experience.isInternal) {
    return <CutInfoInternalPage {...props} />;
  }
  return <NotFound />;
}

function CutInfoInternalPage(props) {
  const { record } = props;
  if (!record) {
    return (
      <div>
      Record not found
      </div>
    );
  }
  return (
    <InfoPage
      record={record}
      sections={[
        getCutInfo(props),
      ]}
    />
  );
}

export function getCutInfo(props) {
  const { record } = props;
  return {
    title: record.modelName,
    record,
    subsections: [
      _basicInfo(props),
      _file(props),
    ],
  };
}

function _basicInfo(props) {
  const { record } = props;
  const body = (
    <List>
      <Header>
        {record.displayName}
      </Header>
      <List.Item>
        <List.Content>
          <b>
          v
            {record.version}
          </b>
          <FromNowDate date={record.createdAt} />
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <b>
          Project:
            {' '}
          </b>
          {' '}
          <a href={getRecordPath(record.project)}>
            {record.projectDisplayName}
          </a>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <b>
            {record.getFieldLabel('deliverableId')}
          </b>
          {' '}
          <a href={getRecordPath(record.deliverable)}>
            {record.deliverableDisplayName}
          </a>
        </List.Content>
      </List.Item>
      <List.Item>
        <Segment>
          <Header>
          Cut Url
          </Header>
          <a target="_blank" href={record.fileUrl}>
            {record.fileUrl}
          </a>
        </Segment>
      </List.Item>
      <List.Item>
        <Segment>
          <Header>
            {' '}
            {record.getFieldLabel('editorNotes')}
            {' '}
          </Header>
          <p>
            {record.editorNotes}
          </p>
        </Segment>
      </List.Item>
      <List.Item>
        <Segment>
          <Header>
            {' '}
            Feedback
            {' '}
          </Header>
          <p>
            {record.revisions}
          </p>
        </Segment>
      </List.Item>
    </List>
  );

  return { subtitle: '', body };
}

function _file(props) {
  const { record } = props;
  const body = (
    <FilePortal
      record={record}
      fieldname="fileId"
      view={FileView}
    />
  );
  return {
    subtitle: 'Cut File',
    body,
  };
}
