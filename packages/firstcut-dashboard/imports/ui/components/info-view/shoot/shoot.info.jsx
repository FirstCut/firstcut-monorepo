import React from 'react';
import PropTypes from 'prop-types';
import {
  Header,
  List,
  Segment,
  Button,
  Container,
} from 'semantic-ui-react';

import { listObjects, getSignedUrlOfKey } from '/imports/api/filestore';
import InfoPage from '/imports/ui/pages/info.page';
import ProfileItem from '../utils/profile.card';
import { UpdateFieldButton } from '/imports/ui/components/utils/utils';
import { isEmpty } from 'firstcut-utils';
import Modals, { ConfirmationModal } from '/imports/ui/components/utils/modals';
import { getRecordPath } from 'firstcut-retrieve-url';
import { userExperience } from '/imports/ui/config';
import ShootInfo, { behindTheScenesSection } from './shoot.components';
import ShootClientInfoPage from './shoot.client';
import ShootVideographerInfoPage from './shoot.videographer';
import { SchemaParser } from '/imports/api/schema';

export function ShootInfoPage(props) {
  if (userExperience().isVideographer) {
    return <ShootVideographerInfoPage {...props} />;
  } if (userExperience().isClient) {
    return <ShootClientInfoPage {...props} />;
  }
  return <ShootInternalInfoPage {...props} />;
}

function ShootInternalInfoPage(props) {
  const { record } = props;
  return (
    <InfoPage
      record={record}
      sections={[
        getShootInfo(props),
        footageFiles(props),
      ]}
    />);
}

export function getShootInfo(props) {
  const { record } = props;
  const screenshotSections = record.getFramingShots().map((s, index) => _screenshotInfo({
    ...props,
    index,
  }));
  let subsections = [_basicInfo(props)];
  if (record.contact && !isEmpty(record.contact)) {
    subsections.push(_contact(props));
  }
  subsections = [
    ...subsections,
    _subjects(props),
    ...screenshotSections,
    behindTheScenesSection(props),
  ];
  return { title: record.modelName, record, subsections };
}

function _basicInfo(props) {
  const { record } = props;
  const body = (
    <Container>
      <List>
        <List.Item>
          <List.Content>
            <b>
              {record.displayName}
            </b>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <b>
              Project:
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
              Extra Event Attendees:
            </b>
            {' '}
            {record.extraCalendarEventAttendees.map(a => `${a.email}, `)}
          </List.Content>
        </List.Item>
        <List.Item>
          <ShootInfo.BasicInfo shoot={record} />
        </List.Item>
        <List.Item>
          <ShootInfo.Agenda shoot={record} />
        </List.Item>
        <List.Item>
          <ShootInfo.Notes shoot={record} />
        </List.Item>
        <List.Item>
          <Segment>
            <Header>
              Script
            </Header>
            <p>
              {record.script}
            </p>
          </Segment>
        </List.Item>
      </List>
    </Container>
  );
  return { subtitle: '', body };
}

function footageFiles(props) {
  return {
    title: 'Footage Files',
    record: props.record,
    subsections: [
      { subtitle: '', body: <FootageFiles {...props} /> },
    ],
  };
}

class FootageFiles extends React.Component {
  state = { keys: [], links: [] }

  componentDidMount() {
    const { record } = this.props;
    let bucket = Meteor.settings.public.target_footage_bucket;
    let prefix = `footage-folders/${record.footageFolderName}`;
    if (!record.hasVerifiedFootage) {
      bucket = Meteor.settings.public.source_footage_bucket;
      prefix = record.footageFolderName;
    }
    listObjects.call({
      Bucket: bucket,
      Prefix: prefix,
    }, (err, res) => {
      if (err) return;
      const keys = res.Contents.map(file => file.Key).slice(1); // remove the first key, which is the directory key
      const links = [];
      const promises = keys.map(key => getSignedUrlOfKey.call({
        bucket,
        key,
      }, (err, res) => {
        if (!err) {
          links.push(res);
          if (links.length === keys.length) {
            this.setState({ links, keys });
          }
        }
      }));
    });
  }

  render() {
    const { links, keys } = this.state;
    const { record } = this.props;

    if (!record.footageFolderName) {
      return <div />;
    }
    return links.map((link, i) => (
      <List.Item>
        <List.Content>
          <a href={link}>
            {keys[i]}
          </a>
        </List.Content>
      </List.Item>
    ));
  }
}

function _subjects(props) {
  const { record } = props;
  return { subtitle: 'Subjects', body: <ShootInfo.SubjectsList shoot={record} /> };
}

function _contact(props) {
  const body = (<ShootInfo.ContactCard contact={props.record.contact} />);
  return { subtitle: 'On-Site Contact', body };
}

function _screenshotInfo(props) {
  const { record, index } = props;
  const s = record.getFramingShots().get(index);
  const items = [];
  if (s.notes) {
    items.push({ icon: 'browser', content: s.notes });
  }

  const subtitle = record.constructor.getScreenshotDisplayString(s);
  const description = {
    fullName: record.getScreenshotApprovalDisplayString(s),
    profilePicture: record.screenshotURL(s.filename),
    items,
  };
  const content = <ProfileItem profile={description} />;
  const approvedField = SchemaParser.buildIndexedObjectArrayField('screenshots', index, 'approved');
  const notesField = SchemaParser.buildIndexedObjectArrayField('screenshots', index, 'notes');

  const ApproveTrigger = (
    <Button positive>
    Approve
    </Button>
  );
  const RejectTrigger = (
    <Button negative>
    Reject
    </Button>
  );
  const RejectScreenshot = (
    <RejectScreenshotModal
      trigger={RejectTrigger}
      record={record}
      field={notesField}
    />);
  const ApproveScreenshot = (
    <UpdateFieldButton
      trigger={ApproveTrigger}
      confirmModal={ApproveScreenshotModal}
      record={record}
      field={approvedField}
      onConfirmValue
    />);

  const hasStatus = record.constructor.screenshotApproved(s) || record.constructor.screenshotRejected(s);
  const actionBar = (hasStatus)
    ? <div />
    : (
      <Button.Group>
        {ApproveScreenshot}
        {RejectScreenshot}
      </Button.Group>
    );
  const body = (
    <Segment>
      <Header>
        {subtitle}
        {actionBar}
      </Header>
      {content}
    </Segment>
  );
  return { subtitle: '', body };
}

function ApproveScreenshotModal(props) {
  return (<ConfirmationModal headerIcon="checkmark" headerText="Approve screenshot?" content="Would you like to approve this screenshot?" {...props} />);
}

function RejectScreenshotModal(props) {
  const { trigger, record, field } = props;
  return (<Modals.UpdateField trigger={trigger} record={record} fields={[field]} headerText="Reject Screenshot?" rejectText="Cancel" confirmText="Confirm" />);
}
