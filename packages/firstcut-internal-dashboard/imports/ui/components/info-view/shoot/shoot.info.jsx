import React from 'react';
import PropTypes from 'prop-types';
import {
  Header,
  List,
  Segment,
  Button,
  Modal,
  Icon,
  Divider,
  Container
} from 'semantic-ui-react';

import {listObjects, getFootageFilesFolder, getSignedUrlOfKey} from 'firstcut-aws';
import InfoPage from '/imports/ui/pages/info.page.jsx';
import ProfileItem from '../utils/profile.card.jsx';
import {FilePortal, FileView, Video} from '/imports/ui/components/utils/file.portal.jsx';
import {HumanReadableDate} from '/imports/ui/components/utils/dates.jsx';
import {UpdateFieldButton} from '/imports/ui/components/utils/utils.jsx';
import {isEmpty, userPlayerId} from 'firstcut-utils';
import Modals, {ConfirmationModal} from '/imports/ui/components/utils/modals.jsx';
import {_} from 'lodash';
import {fulfillsPrerequisites} from 'firstcut-pipeline';
import {Record} from 'immutable';
import {RecordHistory} from '/imports/ui/components/utils/history.jsx';
import {getRecordPath} from 'firstcut-retrieve-url';
import {userExperience} from '/imports/ui/config';
import ShootInfo from './shoot.components.jsx';
import ShootClientInfoPage from './shoot.clientinfo.jsx';
import moment from 'moment';

export function ShootInfoPage(props) {
  if (userExperience() == 'CLIENT' || userExperience() == 'VIDEOGRAPHER') {
    return <ShootClientInfoPage {...props}/>;
  }
  return <ShootInternalInfoPage {...props}/>;
}

function ShootInternalInfoPage(props) {
  const {record} = props;
  return (
    <InfoPage
    record={record}
    sections={[
      getShootInfo(props),
      footageFiles(props)
    ]}
    />)
}

export function getShootInfo(props) {
  const {record} = props;
  const screenshot_sections = record.screenshots.map((s, index) => _screenshotInfo({
    ...props,
    index
  }));
  let subsections = [_basicInfo(props)];
  if (record.contact && !isEmpty(record.contact)) {
    subsections.push(_contact(props));
  }
  subsections = [
    ...subsections,
    _subjects(props),
    ...screenshot_sections
  ];
  return {title: record.model_name, record, subsections};
}

function _basicInfo(props) {
  const {record} = props;
  const body = (
    <Container>
      <ShootInfo.BasicInfo shoot={record}/>
      <List>
        <List.Item>
          <List.Content>
            <b>{record.displayName}</b>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <b>Project: </b>
            <a href={getRecordPath(record.project)}>{record.projectDisplayName}</a>
          </List.Content>
        </List.Item>
        <List.Item>
          <ShootInfo.Agenda shoot={record}/>
        </List.Item>
        <List.Item>
          <ShootInfo.Notes shoot={record}/>
        </List.Item>
        <List.Item>
          <Segment>
            <Header>
              Script
            </Header>
            <p>{record.script}</p>
          </Segment>
        </List.Item>
      </List>
    </Container>
  )
  return {subtitle: '', body};
}

function footageFiles(props) {
  return {
    title: 'Footage Files',
    record: props.record,
    subsections: [
      {subtitle: '', body: <FootageFiles {...props} />}
    ]
  };
}

class FootageFiles extends React.Component {
  state = {keys: [], links: []}

  componentDidMount() {
    let bucket = Meteor.settings.public.target_footage_bucket;
    let prefix = 'footage-folders/' + this.props.record.footageFolderName;
    if (!this.props.record.hasVerifiedFootage) {
      bucket = Meteor.settings.public.source_footage_bucket;
      prefix = this.props.record.footageFolderName;
    }
    listObjects.call({
      Bucket: bucket,
      Prefix: prefix
    }, (err, res) => {
      if (err) return;
      const keys = res.Contents.map(file => file.Key).slice(1); //remove the first key, which is the directory key
      const links = [];
      const promises = keys.map(key => {
        return getSignedUrlOfKey.call({
          bucket: bucket,
          key: key
        }, (err, res) => {
          if (!err) {
            links.push(res);
            if (links.length == keys.length) {
              this.setState({links, keys});
            }
          }
        })
      });
    });
  }

  render() {
    if (!this.props.record.footageFolderName) {
      return <div></div>;
    }
    return this.state.links.map((link, i) => {
      return (
        <List.Item>
          <List.Content>
            <a href={link}>{this.state.keys[i]}</a>
          </List.Content>
        </List.Item>
      )
    });
  }
}

            // <Video src={link}/>
function _subjects(props) {
  const {record} = props;
  return {subtitle: 'Subjects', body: <ShootInfo.SubjectsList shoot={record}/>};
}

function _contact(props) {
  const body = (<ShootInfo.ContactCard contact={props.record.contact}/>);
  return {subtitle: 'On-Site Contact', body};
}

function _screenshotInfo(props) {
  const {record, index} = props;
  const s = record.screenshots.get(index);
  let items = [];
  if (s.notes) {
    items.push({icon: 'browser', content: s.notes});
  }

  const subtitle = record.getScreenshotDisplayString(s);
  const description = {
    fullName: record.getScreenshotApprovalDisplayString(s),
    profilePicture: record.screenshotURL(s.filename),
    items
  }
  const content = <ProfileItem profile={description}/>;
  const approved_field = SchemaParser.buildIndexedObjectArrayField('screenshots', index, 'approved');
  const notes_field = SchemaParser.buildIndexedObjectArrayField('screenshots', index, 'notes');

  const ApproveTrigger = <Button positive>Approve</Button>;
  const RejectTrigger = <Button negative>Reject</Button>;
  const RejectScreenshot = <RejectScreenshotModal trigger={RejectTrigger} record={record} field={notes_field}/>;
  const ApproveScreenshot = (<UpdateFieldButton trigger={ApproveTrigger} confirm_modal={ApproveScreenshotModal} record={record} field={approved_field} on_confirm_value={true}/>)

  const has_status = record.screenshotApproved(s) || record.screenshotRejected(s);
  const action_bar = (has_status)
    ? <div></div>
    : <Button.Group>{ApproveScreenshot}{RejectScreenshot}</Button.Group>
  const body = (
    <Segment>
      <Header>{subtitle}{action_bar}</Header>
      {content}
    </Segment>
  );
  return {subtitle: '', body};
}

function ApproveScreenshotModal(props) {
  return (<ConfirmationModal header_icon='checkmark' header_text='Approve screenshot?' content='Would you like to approve this screenshot?' {...props}/>);
}

function RejectScreenshotModal(props) {
  const {trigger, record, field} = props;
  return (<Modals.UpdateField trigger={trigger} record={record} fields={[field]} header_text='Reject Screenshot?' reject_text='Cancel' confirm_text='Confirm'/>);
}
