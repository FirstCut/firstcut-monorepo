import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Divider,
  Container,
  Header,
  Button,
  Menu,
  Sidebar as SemanticSidebar,
  Segment
} from 'semantic-ui-react';
import {List, Record} from 'immutable';
import {asLink} from '../components/utils/utils.jsx';
import {getRecordPath} from 'firstcut-retrieve-url';
import {getEventActionsAsDescriptiveString} from 'firstcut-pipeline';
import {emitPipelineEvent, userPlayerId} from 'firstcut-utils';
import Modals, {ConfirmationModal} from '../components/utils/modals.jsx';
import Buttons from '../components/utils/buttons.jsx';
import {userHasPermission, canTriggerAction} from '/imports/ui/config';
import {RecordHistory} from '../components/utils/history.jsx';
import GridView from '/imports/ui/components/grid-view/grid.layout.jsx';
import {getUserActions} from '/imports/ui/config';
import {PipelineActionComponent} from '/imports/ui/components/pipeline-actions/actions.jsx';
import withEditRecordModal from '/imports/ui/containers/editrecord.container.jsx';

export default class InfoPage extends React.PureComponent {
  render() {
    const {record, sections, ExtraSidebarItems} = this.props;
    const outer_props = this.props;
    let rows = [
      {columns: [
        {col_props: {width: 12}, component: (props) => <Body {...outer_props } {...props}/>},
        {col_props: {width: 4}, component: (props) => <Sidebar {...outer_props} {...props}/>}
        ]
      }
    ];
    return <Container><GridView rows={rows} grid_props={{celled:true}}/></Container>;
  }
}

const actionProps = PropTypes.arrayOf(PropTypes.shape({node: PropTypes.node, header: PropTypes.string, onAction: PropTypes.func}))

const subsectionProps = PropTypes.arrayOf(PropTypes.shape({subtitle: PropTypes.string, body: PropTypes.node}))

const sectionProps = PropTypes.arrayOf(PropTypes.shape({title: PropTypes.string, record: PropTypes.instanceOf(Record), subsections: subsectionProps, ExtraSidebarItems: PropTypes.node}))

InfoPage.propTypes = {
  sections: sectionProps
};


class Sidebar extends React.PureComponent {
  state = {
    visible: false
  }

  toggleVisibility = () => {
    this.setState({visible: !this.state.visible})
  }

  render() {
    const {visible} = this.state;
    const {
      record,
      display_record_history,
      ...rest
    } = this.props;
    const Actions = withEditRecordModal(ActionButtons);
    const action_items = <Actions as={Menu.Item} record={record}/>
    const history = (
      <div>
        <Divider horizontal>
          History
        </Divider>
        <RecordHistory record={record}/>
      </div>
    );
    return (
      <Menu fluid vertical tabular>
        {action_items}
        {history}
      </Menu>
    )
  }
}

function Body(props) {
  const {sections} = props;
  return (
    <Container>
      {sections.map((props, i) => {
        const react_key = `${props.title}-${i}`;
        return (<Section key={react_key} {...props}/>);
      })
    }
    </Container>
  )
}

function Section(props) {
  return (
    <Container>
      <SectionTitle {...props}/>
      <SectionBody {...props}/>
    </Container>
  )
}

function SectionTitle(props) {
  const {title, record} = props;
  const Wrapper = asLink(Divider);
  return (
    <Wrapper horizontal path={getRecordPath(record)}>{title}</Wrapper>
  )
}

function SectionBody(props) {
  const {record, subsections} = props;
  return (
    <Container>
      {subsections.map((props, i) => {
        const {title} = props;
        const react_key = `${title}-${i}`;
        return (<Subsection key={react_key} {...props}/>)
      })
    }
    </Container>
  )
}

function Subsection(props) {
  return (
    <Container>
      <SubsectionTitle {...props}/>
      <SubsectionBody {...props}/>
    </Container>
  )
}

function SubsectionTitle(props) {
  return (
    <Header>{props.subtitle}</Header>
  );
}

function SubsectionBody(props) {
  return props.body;
}

function ActionButtons(props) {
  const {as, record, editRecord} = props;
  const actions = getUserActions(record);
  const components = [];
  if (userHasPermission({verb: 'WRITE', target: record.model_name})) {
    const header = 'Edit ' + record.model_name;
    const Wrapper = (as)? as : Button;
    components.push(
      <Wrapper onClick={editRecord(record)} className='center aligned'>
        <Button color='blue' fluid>{header}</Button>
      </Wrapper>
    );
  }

  return [...components, ...actions.map(a => {
    return (
      <PipelineActionComponent
        key={`action-trigger-${a}`}
        record={record}
        action={a}
        as={as}
      />
    )
  })];
}
