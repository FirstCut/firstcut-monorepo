
import React from 'react';
import PropTypes from 'prop-types';
import { FilePortal, VideoFrame } from '../components/utils/file.portal.jsx';
import { Icon, Button, Popup, Label, Input, Modal, Message, Container, Header, Segment } from 'semantic-ui-react';
import GridView from '/imports/ui/components/grid-view/grid.layout.jsx';
import { NotFound } from './404.jsx';
import { asUpdateFieldsForm } from '/imports/ui/components/utils/utils.jsx';
import { emitPipelineEvent } from 'firstcut-utils';
import Modals, { ConfirmationModal } from '/imports/ui/components/utils/modals.jsx';
import { EVENTS } from 'firstcut-pipeline';
import { Record } from 'immutable';
import { RecordWithSchemaFactory, BaseModel } from 'firstcut-models';
import { SimpleSchemaWrapper as Schema } from '/imports/api/schema';
import { HumanReadableDate } from '/imports/ui/components/utils/dates.jsx';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {getPublicCutViewLink} from 'firstcut-retrieve-url';

export function PublicCutViewPage(props) {
  const {record} = props;
  if (!record) {
    return <NotFound />
  } else {
    return (
      <Container>
        <Header> {record.displayName} </Header>
        <CutView {...props } />
      </Container>
    )
  }
}

export function ClientCutViewPage(props) {
  const {record} = props;
  const outer_props = props;

  const Feedback = (record.clientHasSubmittedFeedback) ? FeedbackView: FeedbackForm;
  let rows = [
    {columns: [
      {component: (props)=> <HeaderBar {...props} {...outer_props}/> }
    ]},
    {columns: [
      {col_props: {width: 12}, component: (props) => <CutView {...outer_props } {...props}/>},
      {col_props: {width: 4}, component: (props) => <Feedback {...outer_props} {...props}/>}
      ]
    }
  ];

  return (
    <Container>
      <GridView rows={rows} grid_props={{celled:true}}/>
    </Container>
  )
}

class RequestSnippetModal extends React.Component {
  constructor(props) {
    super(props);
    const snippet_regex = new RegExp('[0-9][0-9]:[0-9][0-9]');
    const SnippetSchema = new Schema({
      start: {
        type: String,
        required: true,
        placeholder: '01:25',
        regEx: () => {
          return snippet_regex;
        }
      },
      end: {
        type: String,
        required: true,
        placeholder: '01:45',
        regEx: () => {
          return snippet_regex;
        }
      }
    });
    const SnippetRequest = RecordWithSchemaFactory(Record, SnippetSchema);
    const snippet = new SnippetRequest({});
    this.state = {confirmed: false, all_modals_closed: false, snippet};
  }

  requestSnippet = (snippet) => {
    this.toggleModal();
    emitPipelineEvent({
      event_data: {
        event: EVENTS.snippet_requested,
        start: snippet.start,
        end: snippet.end
      },
      record: this.props.record
    });
  }

  toggleModal = () => {
    const confirmed = !this.state.confirmed;
    this.setState({confirmed});
  }
  closeModals = () => {
    const all_modals_closed = !this.state.all_modals_closed;
    this.setState({all_modals_closed});
  }
  render() {
    const { record } = this.props;
    const fields = ['start', 'end'];
    const request_snippet_button = <Button floated='right' color='green'>Request Snippet</Button>
    return (
      <Container>
      { this.state.confirmed &&
        <ConfirmSnippetRequest open={true} onConfirm={this.toggleModal}/>
      }
      { !this.state.confirmed && record.hasBrandIntro &&
        <Modals.UpdateField
          record={this.state.snippet}
          fields={[fields]}
          trigger={request_snippet_button}
          onSaveSuccess={this.requestSnippet}
          header_text={'Please enter the start and end timestamps for the snippet using mm:ss format (for example 01:23)'}
          reject_text='Cancel'
          confirm_text='Confirm'
          />
      }
      { !record.hasBrandIntro &&
        <Modal
          trigger={request_snippet_button}
          header={'Requirements not fulfilled'}
          content={'It seems we do not have your logo available; please contact teamfirstcut@firstcut.io to continue!'}
          size='small'
          basic
          />
        }
      </Container>
    )
  }
}

class HeaderBar extends React.Component {
  state = {
    copied: false,
  };

  copied = () => {
    this.setState({copied: true});
    Meteor.setTimeout(()=> {
      this.setState({copied: false});
    }, 2000);
  }

  render() {
    const {record} = this.props;
    const public_link = getPublicCutViewLink(record);
    return (
      <Container>
        <Header {...this.props}> {record.displayName} <RequestSnippetModal record={record}/></Header>
        <b> Public link </b>
        <Input
          labelPosition='right'
          value={public_link}
          label={<Popup
            trigger={<CopyToClipboard text={public_link}><Button onClick={this.copied} icon='copy'/></CopyToClipboard>}
            content='Copy to clipboard' size='mini'/>
          }
          />
        { this.state.copied && <b> Copied! </b>}
      </Container>
    )
  }
};

// class CopyText extends React.Component {
//   state = {
//     value: '',
//     copied: false,
//   };
//
//   render() {
//     return (
//       <CopyToClipboard text={this.state.value}
//         onCopy={() => this.setState({copied: true})}>
//         <span>Copy to clipboard with span</span>
//       </CopyToClipboard>
//     )
//   }
// }

function ConfirmSnippetRequest(props) {
  const {open, onConfirm} = props;
  return (
    <Modal basic size='small' open={open}>
      <Header>Thank you for requesting a snippet! Your snippet is processing and will be emailed to you when it is ready</Header>
      <Modal.Actions>
        <Button color='green' inverted onClick={onConfirm}>
          <Icon name='checkmark' />
        </Button>
      </Modal.Actions>
    </Modal>
    )
}

//
// function ConfirmSnippetRequest(props) {
//   const {open, onConfirm} = props;
//   return (
//     <Modal basic size='small' open={open}>
//       <Header>Thank you for requesting a snippet! Your snippet is processing and will be emailed to you when it is ready</Header>
//       <Modal.Actions>
//         <Button color='green' inverted onClick={onConfirm}>
//           <Icon name='checkmark' />
//         </Button>
//       </Modal.Actions>
//     </Modal>
//     )
// }
//
function FeedbackView(props) {
  const { record } = props;
  const submitted_event = record.clientSubmittedFeedbackEvent;
  let submitted = 'UNKNOWN DATE';
  if (submitted_event) {
    submitted = <HumanReadableDate date={submitted_event.timestamp} format='short-full-month'/>
  }
  return (
    <Container style={{height:'90%'}}>
      <Header> You submitted your feedback on {submitted}</Header>
      <p>{record.revisions}</p>
    </Container>
    )
}


function FeedbackForm(props) {
  const {record} = props;
  const save_event = `save.${record.displayName}`;
  const fields = ['revisions'];
  const Form = asUpdateFieldsForm(Container);
  const overrides = {
    'revisions': {rows: '19'},
  }
  const saveFeedback = (e) => {
    PubSub.publish(save_event);
  }
  const submitFeedback = (e) => {
    PubSub.publish(save_event);
    emitPipelineEvent({event_data: { event: EVENTS.feedback_submitted_by_client}, record});
  }
  const submit_feedback_button = <Button basic color='green'>Submit</Button>
  return (
    <Container style={{height:'90%'}}>
      <Form overrides={overrides} save_event={save_event} fields={fields} {...props} />
      <Button.Group attached='bottom'>
        <Save save={saveFeedback} />
        <ConfirmSendFeedback
          onConfirm={submitFeedback}
          onReject={saveFeedback}
          trigger={submit_feedback_button}
          record={record}
          />
      </Button.Group>
    </Container>
    )
}

function Save(props) {
  const { save } = props;
  const save_trigger = (<Button basic color='grey' onClick={save}>Save</Button>);
  return (
    <Modal
    basic
    size='small'
    trigger={save_trigger}
    header={'Feedback saved!'}
    />
  )
}


function ConfirmSendFeedback(props) {
  const {record, trigger, onConfirm, onReject} = props;
  let content = `Are you sure you would like to send this feedback to `;
  if (record.adminOwner) {
    content += `${record.adminOwnerDisplayName}`
  }
  if (record.postpoOwner) {
    content += ` and ${record.postpoOwnerDisplayName}`
  }
  content += '?';
  return (
    <ConfirmationModal
      header_icon='checkmark'
      header_text='Send Feedback?'
      content={content}
      onConfirm={onConfirm}
      onReject={onReject}
      trigger={trigger}
      />
    );
}


function CutView(props) {
  const {record} = props;
  return (
    <Container>
      { record.fileId &&
        <FilePortal
          record={record}
          fieldname='fileId'
          view={VideoFrame}
        />
      }
      {record.fileUrl &&
        <p>
          If you are having trouble viewing this file, you can also find it <a target="_blank" href={record.fileUrl}>here</a>
        </p>
      }
    </Container>
  )
}
