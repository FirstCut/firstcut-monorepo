import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, Image, List, Segment,
} from 'semantic-ui-react';
import ProfileCard from '../utils/profile.card';
import Models from 'firstcut-models';
import { HumanReadableDate } from '/imports/ui/components/utils/dates';
import { SegmentWithHeader } from '/imports/ui/components/utils/utils';

const { Shoot } = Models;

const ShootInfo = {
  Agenda,
  Notes,
  Script,
  SubjectsList,
  SubjectCard,
  ContactCard,
  CollaboratorCard,
  BasicInfo,
};

function behindTheScenesSection(props) {
  const { record } = props;
  const cards = record.getBehindTheScenesShots().map(s => (
    <Card size="small" color="black">
      <Image src={record.screenshotURL(s.filename)} />
    </Card>
  ));

  const body = (
    <Card.Group>
      {cards}
    </Card.Group>
  );
  return { subtitle: 'Behind The Scenes', body };
}

function BasicInfo(props) {
  const { shoot, ...rest } = props;
  return (
    <Segment {...rest}>
      <List>
        { shoot.date
        && (
        <List.Item>
          <List.Icon name="calendar" />
          <List.Content>
            <HumanReadableDate date={shoot.date} enddate={shoot.endDatetime} timezone={shoot.timezone} format="clean" />
          </List.Content>
        </List.Item>
        )
      }
        { shoot.location.name
        && (
        <List.Item>
          <List.Icon name="marker" />
          <List.Content>
            <a target="_blank" href={shoot.locationUrl}>
              {shoot.locationDisplayName}
            </a>
          </List.Content>
        </List.Item>
        )
      }
        { shoot.duration
      && (
      <List.Item>
        <List.Content>
          <b>
          Expected Duration:
          </b>
          {' '}
          {shoot.duration}
          hs
        </List.Content>
      </List.Item>
      )
      }
        { shoot.videographer
      && (
      <List.Item>
        <List.Content>
          <b>
          Videographer:
          </b>
          {' '}
          {shoot.videographerDisplayName}
        </List.Content>
      </List.Item>
      )
      }
        { shoot.interviewer
      && (
      <List.Item>
        <List.Content>
          <b>
          Interviewer:
          </b>
          {' '}
          {shoot.interviewerDisplayName}
        </List.Content>
      </List.Item>
      )
      }
        { shoot.adminOwner
      && (
      <List.Item>
        <List.Content>
          <b>
          Project Manager:
          </b>
          {' '}
          {shoot.adminOwnerDisplayName}
        </List.Content>
      </List.Item>
      )
      }
      </List>
    </Segment>
  );
}

function SubjectsList(props) {
  const { shoot, ...rest } = props;
  return shoot.subjects.map(s => <SubjectCard {...rest} subject={s} />);
}
function SubjectCard(props) {
  const { subject, ...rest } = { ...props };
  const profile = {
    fullName: subject.fullname,
    subheader: subject.title,
    profilePicture: Shoot.headshotURL(subject.headshot),
    items: [{
      icon: 'building outline',
      content: subject.company,
    }],
  };
  return (<ProfileCard {...rest} profile={profile} />);
}

function ContactCard(props) {
  const { contact, ...rest } = { ...props };
  const profile = {
    fullName: contact.fullname,
    items: [{
      icon: 'phone',
      content: contact.phone,
    }, {
      icon: 'mail',
      content: contact.email,
    }],
  };
  return (<ProfileCard {...rest} profile={profile} />);
}

function CollaboratorCard(props) {
  const { record, ...rest } = props;
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
    }],
  };
  return (<ProfileCard profile={profile} {...rest} />);
}

function Script(props) {
  const { shoot, ...rest } = props;
  return <SegmentWithHeader header="Script" body={shoot.script} {...rest} />;
}

function Agenda(props) {
  const { shoot, ...rest } = props;
  return <SegmentWithHeader header="Agenda" body={shoot.agenda} {...rest} />;
}

function Notes(props) {
  const { shoot, ...rest } = props;
  return <SegmentWithHeader header="Notes" body={shoot.notes} {...rest} />;
}

export default ShootInfo;
export { behindTheScenesSection };
