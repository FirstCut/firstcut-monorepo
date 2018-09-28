
import React from 'react';
import PropTypes from 'prop-types';
import Models from 'firstcut-models';
import { userPlayer, userPlayerId } from 'firstcut-players';
import { _ } from 'lodash';
import { humanReadableDate } from 'firstcut-utils';
import { Map } from 'immutable';
import { getRecordPath } from 'firstcut-retrieve-url';
import withEditRecordModal from '/imports/ui/containers/editrecord.container';
import withMultiRecord from '/imports/ui/containers/multirecord.container';
import { PipelineActionComponent } from '/imports/ui/components/pipeline-actions/actions';
import { asLinkToRecord, asLink } from '/imports/ui/components/utils/utils';
import {
  Divider, Icon, Card, Container, Sidebar, Label, Button,
} from 'semantic-ui-react';
import Buttons from '/imports/ui/components/utils/buttons';

const { Task } = Models;

export function getTaskInfo(props) {
  const { record, editRecord } = props;
  const options = {
    assignedTo: userPlayer(),
  };
  const tasks = (record.getCompleteRecordAndChildrenTasks)
    ? record.getCompleteRecordAndChildrenTasks(options) : record.getRelatedTasks(options);
  const subsections = [{ subtitle: '', body: <TasksList tasks={tasks} editRecord={editRecord} /> }];
  return { title: '', record, subsections };
}

export default function TasksList(props) {
  const Component = _.flowRight(withMultiRecord, withEditRecordModal)(TasksListComponent);
  return (
    <Component
      {...props}
      model={Task}
      filter={{ assignedToPlayerId: userPlayerId(), completed: { $ne: true } }}
    />
  );
}

function TasksListComponent(props) {
  const { records, editRecord } = props;
  // const canCreateNewTask = editRecord && userHasPermission({ verb: 'CREATE', target: Task.modelName });
  return (
    <div>
      <Divider horizontal>
        <Icon name="tasks" />
          TASKS
      </Divider>
      <TaskCards tasks={records} />
    </div>
  );
}

function TaskCards(props) {
  const { tasks } = props;
  const sorted = _.sortBy(tasks.toArray(), ['dateDue']);
  const cardProps = {
    style: {
      'margin-right': 'auto',
      'margin-left': 'auto',
      'margin-bottom': '10px',
    },
  };
  const CardComponent = withEditRecordModal(TaskCard);
  return (
    <Container>
      { sorted.map(task => <CardComponent cardProps={cardProps} task={task} />)}
    </Container>
  );
}

function NewTaskButton(props) {
  const { editRecord } = props;
  return <Buttons.AddNew key="new" onClick={editRecord(Task.createNew({}))} />;
}

const CARD_LABELS = new Map({
  PAST_DUE: (
    <Label as="a" color="red" corner="left" icon="warning" />
  ),
  UPCOMING: (
    <Label as="a" color="yellow" corner="left" icon="clock outline" />
  ),
  DEFAULT: (<div />),
});

class TaskCard extends React.PureComponent {
  state = { visible: false }

  toggleSiderbarVisibility = () => { this.setState({ visible: !this.state.visible }); }

  hideSidebar = () => { this.setState({ visible: false }); }

  handleEdit = (e) => {
    const { task, editRecord } = this.props;
    e.preventDefault();
    editRecord(task)();
  }

  render() {
    const { task, cardProps, editRecord } = this.props;
    let label = CARD_LABELS.get('DEFAULT');
    if (task.isPastDue()) {
      label = CARD_LABELS.get('PAST_DUE');
    } else if (task.isUpcoming()) {
      label = CARD_LABELS.get('UPCOMING');
    }
    const ContentWrapper = asLink(Card.Content);
    const LinkToRecord = asLinkToRecord(Button);
    return (
      <Sidebar.Pushable
        as={Card}
        onMouseEnter={this.toggleSiderbarVisibility}
        onMouseLeave={this.hideSidebar}
        {...cardProps}
      >
        <Sidebar
          animation="push"
          direction="right"
          icon="labeled"
          as={Button.Group}
          vertical
          visible={this.state.visible}
          style={{ width: '100px' }}
        >
          <Button color="blue" onClick={this.handleEdit} className="center aligned">
            Edit
          </Button>
          <PipelineActionComponent
            as={Button}
            triggerProps={{ color: 'green' }}
            record={task}
            basic
            action="mark_task_as_complete"
          />
        </Sidebar>
        <ContentWrapper
          getPath={() => getRecordPath(task.getRelatedRecord())}
        >
          { label }
          <Card.Header>
            {task.displayName}
          </Card.Header>
          <Card.Meta>
            {humanReadableDate({ date: task.getDueDate(), format: 'clean' })}
          </Card.Meta>
          <Card.Description>
            {task.getRelatedRecordDisplayName()}
          </Card.Description>
        </ContentWrapper>
      </Sidebar.Pushable>
    );
  }
}
