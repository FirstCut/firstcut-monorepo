
import React from 'react';
import PropTypes from 'prop-types';
import Models from '/imports/api/models';
import { Button, Label } from 'semantic-ui-react';
import { userPlayerId } from 'firstcut-user-session';
import { withTracker } from 'meteor/react-meteor-data';
import { HumanReadableDate } from './dates';
import { asLink, USDollars, asLinkToRecord } from './utils';
import withEditRecordModal from '/imports/ui/containers/editrecord.container';
import { ActionButtons } from '/imports/ui/components/pipeline-actions/actions';
import { userHasPermission } from '/imports/ui/config';

const UnreadMessages = withTracker((props) => {
  const { record } = props;
  const handle = Meteor.subscribe('project.messages', record._id);
  const messages = record.getUnreadMessages(userPlayerId());
  return { messages };
})(UnreadMessagesCell);

function UnreadMessagesCell(props) {
  const { messages } = props;
  // const handle = Meteor.subscribe('project.messages', record._id);
  // const messages = record.getUnreadMessages(userPlayerId());
  const val = messages.length;
  let color = 'green';
  if (val > 0) {
    color = 'red';
  }
  return (
    <Label color={color}>
      {' '}
      {val}
      {' '}
    </Label>
  );
}

function LinkCell(props) {
  const { record, field, ...rest } = props;
  const Cell = asLink(Button);
  return (
    <Cell {...props} color="blue" fluid basic>
      {' '}
      {record[field]}
      {' '}
    </Cell>
  );
}

function ActionsCell(props) {
  const ActionsContainer = withEditRecordModal(ActionsCellContainer);
  return <ActionsContainer {...props} />;
}

function ActionsCellContainer(props) {
  const { editRecord, record, showUserActions = false } = props;
  const LinkButton = asLinkToRecord(Button);
  const canEdit = userHasPermission({ verb: 'WRITE', target: record.modelName });
  const canCreateTask = userHasPermission({ verb: 'CREATE', target: Models.Task.modelName });
  return (
    <div>
      <Button.Group>
        { canEdit
          && <Button onClick={editRecord(record)} icon="edit" basic color="red" />
        }
        { canCreateTask
          && <Button onClick={editRecord(record.createNewRelatedTask({}))} icon="tasks" basic color="yellow" />
        }
        <LinkButton record={record} icon="search" basic color="green" />
      </Button.Group>
      { showUserActions
        && <ActionButtons record={record} />
      }
    </div>
  );
}

class FetchAsync extends React.Component {
  state = { val: '' }

  componentDidMount() {
    const { func, ...rest } = this.props;
    this.props.func(rest, (err, val) => {
      if (val === true) {
        val = 'true';
      }
      if (val === false) {
        val = 'false';
      }
      this.setState({ val });
    });
  }

  render() {
    const {
      func, record, field, ...rest
    } = this.props;
    return (
      <div {...rest}>
        {this.state.val}
      </div>
    );
  }
}

function BooleanValueCell(props) {
  const { record, field, ...rest } = props;
  let val = record[field];
  if (!val) {
    val = 'False';
  } else {
    val = 'True';
  }
  return (
    <div {...rest}>
      {val}
    </div>
  );
}

function PlainValueCell(props) {
  const { record, field, ...rest } = props;
  return (
    <div {...rest}>
      {record[field]}
    </div>
  );
}

function USDollarsCell(props) {
  const { record, field, ...rest } = props;
  return <USDollars amount={record[field]} />;
}

function DisplayDateCell(props) {
  const { record, field, ...rest } = props;
  return <HumanReadableDate date={record[field]} timezone={record.timezone} {...rest} />;
}

const Cells = Object.freeze({
  Link: LinkCell,
  DisplayDate: DisplayDateCell,
  PlainValue: PlainValueCell,
  Bool: BooleanValueCell,
  FetchAsync,
  USDollars: USDollarsCell,
  Actions: ActionsCell,
  UnreadMessages,
});

export default Cells;