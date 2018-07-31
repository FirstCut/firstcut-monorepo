import React from 'react';
import PropTypes from 'prop-types';
import { Header, Container } from 'semantic-ui-react';
import {getUserActions} from '/imports/ui/config';
import {EVENT_ACTION_TITLES} from 'firstcut-pipeline';

import { _ } from 'lodash';
import ShootInfo from './shoot.components.jsx';
import GridView from '/imports/ui/components/grid-view/grid.layout.jsx';
import {PipelineActionComponent} from '/imports/ui/components/pipeline-actions/actions.jsx';

export default function ShootClientInfoPage(props) {
  const {record} = props;
  const subject_rows = _getSubjectRows(props);
  const row_props = {columns: 'equal'};
  let rows = [
    {row_props, columns: [{component: (props) => <TitleRow record={record} {...props}/>}]},
    {row_props, columns: [
      {component: (props) => <ShootInfo.BasicInfo shoot={record} {...props}/>},
      {component: (props) => <GridView {...props} rows={[
        {row_props, columns: [{component: (props) => <ShootInfo.Agenda shoot={record} {...props}/> }]},
        {row_props, columns: [{component: (props) => <ShootInfo.Notes shoot={record} {...props}/> }]}
      ]}/>}
    ]},
    ...subject_rows,
    {row_props, columns: [{component: (props)=> <ShootInfo.Script shoot={record} {...props}/>}]},
  ]
  return <Container><GridView rows={rows} /></Container>;
}

function TitleRow(props) {
  const {record} = props;
  return (<Header textAlign='center'>{record.displayName} <ActionBar record={record}/> </Header>);
}

function ActionBar(props) {
  const {record} = props;
  const actions = getUserActions(record);
  return actions.map(a => {
    return (
      <PipelineActionComponent
        key={`action-trigger-${a}`}
        record={record}
        action={a}
        title={EVENT_ACTION_TITLES[a]}
      />
    )
  });
}

function _getSubjectRows(props) {
  const SUBJECTS_PER_ROW = 3;
  const {record} = props;
  const rows = _.chunk(record.subjects, SUBJECTS_PER_ROW);
  const row_props = {columns: 'equal'};
  return rows.map(subjects => {
    const columns = subjects.map(s => {
      return {component: (props) => <ShootInfo.SubjectCard {...props} subject={s}/>}
    });
    return {row_props, columns}
  });
}
