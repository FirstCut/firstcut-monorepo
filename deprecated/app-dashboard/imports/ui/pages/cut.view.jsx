
import React from 'react';
import Analytics from 'firstcut-analytics';
import { Link } from 'react-router-dom';
import {
  Icon, Button, Popup, Input, Modal, Container, Header,
} from 'semantic-ui-react';
import GridView from '/imports/ui/components/grid-view/grid.layout';
import { asUpdateFieldsForm } from '/imports/ui/components/utils/utils';
import { userExperience } from '/imports/ui/config';
import { emitPipelineEvent } from 'firstcut-pipeline-utils';
import Modals, { ConfirmationModal } from '/imports/ui/components/utils/modals';
import { EVENTS, ADD_ONS } from 'firstcut-pipeline-consts';
import { Record } from 'immutable';
import { RecordWithSchemaFactory } from 'firstcut-model-base';
import { SimpleSchemaWrapper as Schema } from 'firstcut-schema';
import { HumanReadableDate } from '/imports/ui/components/utils/dates';
import { PipelineActionComponent } from '/imports/ui/components/pipeline-actions/actions';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getPublicCutViewLink } from 'firstcut-retrieve-url';
import { PubSub } from 'pubsub-js';
import { NotFound } from './404';
import { FilePortal, VideoFrame } from '../components/utils/file.portal';

export function PublicCutViewPage(props) {
  const { record } = props;
  if (!record) {
    return <NotFound />;
  }
  return (
    <Container>
      <Header>
        {' '}
        {record.displayName}
        {' '}
      </Header>
      <CutView {...props} />
    </Container>
  );
}

export function ClientCutViewPage(props) {
  const { record } = props;
  const outerProps = props;

  const Feedback = (record.clientHasSubmittedFeedback) ? FeedbackView : FeedbackForm;
  const rows = [
    {
      columns: [
        { component: innerProps => <HeaderBar {...innerProps} {...outerProps} /> },
      ],
    },
    {
      columns: [
        {
          colProps: { width: 12 },
          component: innerProps => <CutView {...outerProps} {...innerProps} />,
        },
        {
          colProps: { width: 4 },
          component: innerProps => <Feedback {...outerProps} {...innerProps} />,
        },
      ],
    },
  ];

  return (
    <Container>
      <GridView rows={rows} gridProps={{ centered: true, celled: true }} />
    </Container>
  );
}

class RequestSnippetModal extends React.Component {
  constructor(props) {
    super(props);
    const snippetRegex = new RegExp('[0-9][0-9]:[0-9][0-9]');
    const SnippetSchema = new Schema({
      start: {
        type: String,
        required: true,
        placeholder: '01:25',
        regEx: () => snippetRegex,
      },
      end: {
        type: String,
        required: true,
        placeholder: '01:45',
        regEx: () => snippetRegex,
      },
    });
    const SnippetRequest = RecordWithSchemaFactory(Record, SnippetSchema);
    const snippet = new SnippetRequest({});
    this.state = { confirmed: false, allModalsClosed: false, snippet };
  }

  requestSnippet = (snippet) => {
    const { record } = this.props;
    this.toggleModal();
    emitPipelineEvent({
      event_data: {
        event: EVENTS.snippet_requested,
        start: snippet.start,
        end: snippet.end,
      },
      record,
    });
  }

  toggleModal = () => {
    const confirmed = !this.state.confirmed;
    this.setState({ confirmed });
  }

  closeModals = () => {
    const allModalsClosed = !this.state.allModalsClosed;
    this.setState({ allModalsClosed });
  }

  render() {
    const { record } = this.props;
    const { confirmed, snippet } = this.state;
    const fields = ['start', 'end'];
    const requestSnippetButton = (
      <Button floated="right" color="green" onClick={() => Analytics.trackClickEvent({ name: 'Request snippet', _id: record._id })}>
        Request Snippet
      </Button>
    );
    return (
      <Container>
        { confirmed
          && <ConfirmSnippetRequest open onConfirm={this.toggleModal} />
      }
        { !confirmed && record.hasBrandIntro
        && (
        <Modals.UpdateField
          record={snippet}
          fields={[fields]}
          trigger={requestSnippetButton}
          onSaveSuccess={this.requestSnippet}
          headerText="Please enter the start and end timestamps for the snippet using mm:ss format (for example 01:23)"
          rejectText="Cancel"
          confirmText="Confirm"
        />
        )
      }
        { !record.hasBrandIntro
        && (
        <Modal
          trigger={requestSnippetButton}
          header="Requirements not fulfilled"
          content="It seems we do not have your logo available; please contact teamfirstcut@firstcut.io to continue!"
          size="small"
          basic
        />
        )
        }
      </Container>
    );
  }
}

class HeaderBar extends React.Component {
  state = {
    copied: false,
  };

  setCopied = () => {
    this.setState({ copied: true });
    Meteor.setTimeout(() => {
      this.setState({ copied: false });
    }, 2000);
  }

  render() {
    const { record } = this.props;
    const { copied } = this.state;
    const publicLink = getPublicCutViewLink(record);
    return (
      <Container>
        <Header {...this.props}>
          {' '}
          {record.displayName}
          {' '}
        </Header>
        <b>
          {' '}
          Public link
          {' '}
        </b>
        <Input
          labelPosition="right"
          value={publicLink}
          label={(
            <Popup
              trigger={(
                <CopyToClipboard text={publicLink}>
                  <Button onClick={this.setCopied} icon="copy" />
                </CopyToClipboard>
              )}
              content="Copy to clipboard"
              size="mini"
            />
          )
          }
        />
        { copied && (
        <b>
          {' '}
          Copied!
          {' '}
        </b>
        )}
      </Container>
    );
  }
}

function ConfirmSnippetRequest(props) {
  const { open, onConfirm } = props;
  return (
    <Modal basic size="small" open={open}>
      <Header>
        Thank you for requesting a snippet! Your snippet is processing and will be emailed to you when it is ready
      </Header>
      <Modal.Actions>
        <Button color="green" inverted onClick={onConfirm}>
          <Icon name="checkmark" />
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

const AddOnButtons = (props) => {
  const { record } = props;
  const trackAddOnClickEvent = addOn => () => {
    Analytics.trackClickEvent({ name: addOn, addOn, _id: record._id });
  };
  const onConfirmAddOn = addOn => () => {
    Analytics.trackClickEvent({ name: `Confirmed request for ${addOn}`, addOn, _id: record._id });
    emitPipelineEvent({
      event: 'add_on_requested',
      addOn,
      record,
    });
  };
  const socialMediaSnippetButton = (
    <ConfirmationModal
      onConfirm={onConfirmAddOn(ADD_ONS.SOCIAL_MEDIA_SNIPPET)}
      content="Social media snippets are a great way to maximize your content for a fraction of the cost through reuse of your existing footage. By confirming, your request will be sent to your producer who will be in touch shortly. We charge $150 per snippet."
      headerText="Request a social media snippet?"
      trigger={(
        <Button onClick={trackAddOnClickEvent(ADD_ONS.SOCIAL_MEDIA_SNIPPET)}>
        Get Social Media Snippet
        </Button>
      )}
    />
  );
  const getCaptionsButton = (
    <ConfirmationModal
      onConfirm={onConfirmAddOn(ADD_ONS.CAPTIONS)}
      content="Social media platforms like Facebook and Instagram play videos without sound by default; captions allow your audience to watch your video without having to turn on their sound. By confirming, your request will be sent to your producer who will be in touch shortly. We charge $35 for captions."
      headerText="Request captions?"
      trigger={(
        <Button onClick={trackAddOnClickEvent(ADD_ONS.CAPTIONS)}>
        Get Captions
        </Button>
      )}
    />
  );
  const getTranscriptButton = (
    <ConfirmationModal
      onConfirm={onConfirmAddOn(ADD_ONS.TRANSCRIPT)}
      content="Transcripts make it easy to search through the content of your interviews. Find valuable quotes to put in case studies, your website, or social media. By confirming, your request will be sent to your producer who will be in touch shortly. We charge $6/minute for transcripts."
      headerText="Request the full interview transcript?"
      trigger={(
        <Button onClick={trackAddOnClickEvent(ADD_ONS.TRANSCRIPT)}>
        Get Transcript
        </Button>
      )}
    />
  );
  return (
    <Button.Group color="green" floated="left" fluid>
      {socialMediaSnippetButton}
      {getTranscriptButton}
      {getCaptionsButton}
    </Button.Group>
  );
};


function FeedbackView(props) {
  const { record } = props;
  const submittedEvent = record.clientSubmittedFeedbackEvent;
  let submitted = 'UNKNOWN DATE';
  if (submittedEvent) {
    submitted = <HumanReadableDate date={submittedEvent.timestamp} format="short-full-month" />;
  }
  return (
    <Container style={{ 'padding-bottom': '10px', height: '90%' }}>
      { record.clientHasSubmittedFeedback
        && (
        <Header>
          {' '}
        You submitted your feedback on
          {submitted}
        </Header>
        )
    }
      <p>
        {record.revisions}
      </p>
    </Container>
  );
}


function FeedbackForm(props) {
  if (userExperience().isClient) {
    return <ClientFeedbackForm {...props} />;
  }
  return <PublicFeedbackForm {...props} />;
}

function PublicFeedbackForm(props) {
  const { record } = props;
  return (
    <div>
      <FeedbackView record={record} />
      <Button.Group vertical attached="bottom">
        <PipelineActionComponent
          action="edit_feedback"
          record={record}
          triggerProps={{ color: 'green', fluid: true }}
        />
        <Button color="blue" as={Link} to="/login">
          Login To Submit Feedback To Producer
        </Button>
      </Button.Group>
    </div>
  );
}

function ClientFeedbackForm(props) {
  const { record } = props;

  const saveEvent = `save.${record.displayName}`;
  const fields = ['revisions'];
  const Form = asUpdateFieldsForm(Container);
  const overrides = {
    revisions: { rows: '19' },
  };
  const saveFeedback = () => {
    PubSub.publish(saveEvent);
  };
  const submitFeedback = () => {
    PubSub.publish(saveEvent);
    emitPipelineEvent({ event: EVENTS.feedback_submitted_by_client, record });
  };
  const submitFeedbackButton = (
    <Button basic color="green">
      Send To Producer
    </Button>
  );
  return (
    <Container style={{ height: '90%' }}>
      <Form overrides={overrides} saveEvent={saveEvent} fields={fields} {...props} />
      <Button.Group attached="bottom">
        <Save save={saveFeedback} />
        <ConfirmSendFeedback
          onConfirm={submitFeedback}
          onReject={saveFeedback}
          trigger={submitFeedbackButton}
          record={record}
        />
      </Button.Group>
    </Container>
  );
}

function Save(props) {
  const { save } = props;
  const saveTrigger = (
    <Button basic color="grey" onClick={save}>
      Save
    </Button>
  );
  return (
    <Modal
      basic
      size="small"
      trigger={saveTrigger}
      header="Feedback saved!"
    />
  );
}


function ConfirmSendFeedback(props) {
  const {
    record, trigger, onConfirm, onReject,
  } = props;
  let content = 'Are you sure you would like to send this feedback to ';
  if (record.adminOwner) {
    content += `${record.adminOwnerDisplayName}`;
  }
  if (record.postpoOwner) {
    content += ` and ${record.postpoOwnerDisplayName}`;
  }
  content += '? You will no longer be able to edit your feedback. Select "Save" if you are unsure.';
  return (
    <ConfirmationModal
      headerIcon="checkmark"
      headerText="Send feedback to your producer?"
      content={content}
      onConfirm={onConfirm}
      onReject={onReject}
      trigger={trigger}
    />
  );
}


function CutView(props) {
  const { record } = props;
  return (
    <Container>
      {record.fileUrl
        && (
        <p>
          If you are having trouble viewing this file, you can also find it
          {' '}
          <a target="_blank" href={record.fileUrl}>
          here
          </a>
        </p>
        )
      }
      { record.fileId
        && (
        <FilePortal
          record={record}
          fieldname="fileId"
          view={VideoFrame}
        />
        )
      }
      { !userExperience().isPublic
        && <AddOnButtons record={record} />
      }
    </Container>
  );
}
