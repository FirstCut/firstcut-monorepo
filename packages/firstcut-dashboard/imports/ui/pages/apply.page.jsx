
import React from 'react';
import { Autoform } from 'firstcut-react-autoform';
import { withRecordManager } from '/imports/ui/components/managers';
import {
  Container, Header, Button, Segment, Modal,
} from 'semantic-ui-react';
import PubSub from 'pubsub-js';
import {
  userPlayer, playerIsClient, initializeCollaboratorFromUser, setPlayerId,
} from 'firstcut-players';
import { emitPipelineEvent } from 'firstcut-utils';
import { getRecordPath } from 'firstcut-retrieve-url';
import Analytics from 'firstcut-analytics';

export default class ApplyToBeAVideographerPage extends React.Component {
  state = { confirmationOpen: false }

  componentDidMount() {
    Analytics.trackNavigationEvent({ name: 'apply to be a creator', basepath: 'apply' });
  }

  toggleModal = () => {
    const open = !this.state.confirmationOpen;
    this.setState({ confirmationOpen: open });
  }

  onSaveSuccess = (record) => {
    this.toggleModal();
    emitPipelineEvent({
      record,
      event: 'application_submitted',
      email: record.email,
      firstName: record.firstName,
    });
    setPlayerId.call({ playerId: record._id }, (err, res) => {
      this.redirectToProfile();
    });
  }

  redirectToProfile = () => {
    const player = userPlayer();
    this.props.history.push(getRecordPath(player));
  }

  render() {
    const AppForm = withRecordManager(ApplicationForm);
    const player = userPlayer() || initializeCollaboratorFromUser(Meteor.user());
    if (playerIsClient(player)) {
      return (
        <Container>
          <Segment>
            <Header>
              {' '}
              You already have a registered client profile with us under this email. If you would like to apply to be a collaborator at FirstCut, either register under a new email or contact us at teamfirstcut@firstcut.io
            </Header>
          </Segment>
        </Container>
      );
    }
    const saveEvent = 'save.videographer_application';
    const submitApplication = (e) => {
      PubSub.publish(saveEvent);
    };
    const formProps = {
      saveEvent,
      seedRecord: player,
      onSaveSuccess: this.onSaveSuccess,
    };

    return (
      <div>
        <Container>
          <Segment padded>
            <Header>
              {' '}
                Apply to be a FirstCut Creator
              {' '}
            </Header>
            <AppForm {...formProps} />
            <Button onClick={submitApplication} primary fluid>
              Submit Application
            </Button>
          </Segment>
        </Container>
        <ConfirmationModal
          open={this.state.confirmationOpen}
          onConfirm={this.redirectToProfile}
        />
      </div>
    );
  }
}

function ApplicationForm(props) {
  const { record, errors } = props;
  const AVAILABLE_SKILLS = {
    VIDEO_PROJECT_MANAGEMENT: 'Video Project Management',
    CORPORATE_VIDEOGRAPHY: 'Corporate Videography',
    CONDUCTING_INTERVIEWS: 'Conducting Interviews',
    VIDEO_EDITING: 'Video Editing',
    MOTIONGRAPHICS: 'Motiongraphics',
    AUDIO_EDITING: 'Audio Editing',
  };
  const overrides = {
    isActive: { defaultValue: false, hidden: true },
    taxCompliant: { defaultValue: false, hidden: true },
    location: { label: 'City', placeholder: 'Please enter the city where you are based', locationTypes: ['(cities)'] },
    skillsSelect: { label: 'Skills applying for', customType: 'multiselect', enumOptions: AVAILABLE_SKILLS },
  };
  const fields = [
    ['firstName', 'lastName'],
    ['email', 'phone'],
    'skillsSelect',
    'location',
    'portfolioUrl',
    'applicationNotes',
  ];

  const onChange = (e, { name, value }) => {
    if (name === 'skillsSelect') {
      const skills = value.map(skill => ({ type: skill, isQualified: false }));
      props.onChange(e, { name: 'skills', value: skills });
    } else {
      props.onChange(e, { name, value });
    }
  };

  return (
    <Autoform
      record={record}
      fields={fields}
      errors={errors}
      overrides={overrides}
      onChange={onChange}
    />
  );
}

function ConfirmationModal(props) {
  const { open, onConfirm } = props;
  const headerIcon = 'checkmark';
  const headerText = 'Application submitted';
  return (
    <Modal open={open} basic>
      <Header icon={headerIcon} content={headerText} />
      <Modal.Actions>
        <Button color="green" inverted onClick={onConfirm}>
          Go to my profile
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
