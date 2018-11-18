import React from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  Container,
  Header,
  Button,
  Menu,
} from 'semantic-ui-react';
import { Record } from 'immutable';
import { asLink } from '../components/utils/utils';
import { getRecordPath } from 'firstcut-retrieve-url';
import RecordHistory from '../components/utils/history';
import GridView from '/imports/ui/components/grid-view/grid.layout';
import { ActionButtons } from '/imports/ui/components/pipeline-actions/actions';
import withEditRecordModal from '/imports/ui/containers/editrecord.container';
import { userHasPermission } from '/imports/ui/config';

export default class InfoPage extends React.PureComponent {
  render() {
    const { record, sections } = this.props;
    const outerProps = this.props;
    const rows = [
      {
        columns: [
          { colProps: { width: 12 }, component: props => <Body {...outerProps} {...props} /> },
          { colProps: { width: 4 }, component: props => <InfoSidebar {...outerProps} {...props} /> },
        ],
      },
    ];
    return (
      <Container>
        <GridView
          rows={rows}
          gridProps={{
            centered: true, divided: true, padded: true, relaxed: true,
          }}
        />
      </Container>
    );
  }
}

function InfoSidebar(props) {
  const { record } = props;
  const Actions = withEditRecordModal(SidebarActions);
  const history = (
    <div>
      <Divider horizontal>
          Activities
      </Divider>
      <RecordHistory record={record} />
    </div>
  );
  return (
    <Menu fluid vertical tabular className="no-border">
      <Actions {...props} />
      {history}
    </Menu>
  );
}

function SidebarActions(props) {
  const { record, editRecord } = props;
  const actionItems = <ActionButtons as={ActionComponent} record={record} />;
  const canEdit = userHasPermission({ verb: 'WRITE', target: record.modelName });
  const canCreateNewTask = editRecord && userHasPermission({ verb: 'CREATE', target: 'Task' });

  return (
    <Menu fluid vertical tabular className="no-border">
      { canEdit
        && (
        <Menu.Item onClick={editRecord(record)} className="center aligned">
          <Button color="blue" fluid>
            Edit
          </Button>
        </Menu.Item>
        )
        }
      { canCreateNewTask
        && (
        <Menu.Item onClick={editRecord(record.createNewRelatedTask())} className="center aligned">
          <Button color="yellow" fluid>
            Add New Task
          </Button>
        </Menu.Item>
        )
        }
      {actionItems}
    </Menu>
  );
}

function ActionComponent(props) {
  return (
    <Menu.Item>
      <Button {...props} fluid color="green" className="center aligned" />
    </Menu.Item>
  );
}

function Body(props) {
  const { sections } = props;
  return (
    <Container>
      {sections.map((props, i) => {
        const { title } = props;
        const reactKey = `${title}-${i}`;
        return (<Section key={reactKey} {...props} />);
      })
    }
    </Container>
  );
}

function Section(props) {
  return (
    <Container>
      <SectionTitle {...props} />
      <SectionBody {...props} />
    </Container>
  );
}

function SectionTitle(props) {
  const { title, record } = props;
  const Wrapper = asLink(Divider);
  return (
    <Wrapper horizontal path={getRecordPath(record)}>
      {title}
    </Wrapper>
  );
}

function SectionBody(props) {
  const { record, subsections } = props;
  return (
    <Container>
      {subsections.map((props, i) => {
        const { title } = props;
        const reactKey = `${title}-${i}`;
        return (<Subsection key={reactKey} {...props} />);
      })
    }
    </Container>
  );
}

function Subsection(props) {
  return (
    <Container style={{ marginTop: '10px' }}>
      <SubsectionTitle {...props} />
      <SubsectionBody {...props} />
    </Container>
  );
}

function SubsectionTitle(props) {
  const { subtitle } = props;
  return (
    <Header>
      {subtitle}
    </Header>
  );
}

function SubsectionBody(props) {
  return props.body;
}
