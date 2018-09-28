import React from 'react';
import PropTypes from 'prop-types';
import { Header, Container, Button } from 'semantic-ui-react';
import { _ } from 'lodash';
import ShootInfo from './shoot.components';
import GridView from '/imports/ui/components/grid-view/grid.layout';
import { ActionButtons } from '/imports/ui/components/pipeline-actions/actions';

export default function ShootClientInfoPage(props) {
  const { record } = props;
  const subjectRows = _getSubjectRows(props);
  const rowProps = { columns: 'equal' };
  const rows = [
    { rowProps: { ...rowProps, verticalAlign: 'middle' }, columns: [{ component: props => <TitleRow record={record} {...props} /> }] },
    {
      rowProps,
      columns: [
        { component: props => <ShootInfo.BasicInfo shoot={record} {...props} /> },
        {
          component: props => (
            <GridView
              {...props}
              rows={[
                { rowProps, columns: [{ component: props => <ShootInfo.Agenda shoot={record} {...props} /> }] },
                { rowProps, columns: [{ component: props => <ShootInfo.Notes shoot={record} {...props} /> }] },
              ]}
            />
          ),
        },
      ],
    },
    ...subjectRows,
    { rowProps, columns: [{ component: props => <ShootInfo.Script shoot={record} {...props} /> }] },
  ];
  return (
    <Container>
      <GridView rows={rows} />
    </Container>
  );
}

function TitleRow(props) {
  const { record } = props;
  return (
    <Container>
      <Header>
        {record.displayName}
        <ActionButtons as={ActionComponent} record={record} />
      </Header>
    </Container>
  );
}

function ActionComponent(props) {
  return <Button floated="right" {...props} color="green" />;
}

function _getSubjectRows(props) {
  const SUBJECTS_PER_ROW = 3;
  const { record } = props;
  const rows = _.chunk(record.subjects, SUBJECTS_PER_ROW);
  const rowProps = { columns: 'equal' };
  return rows.map((subjects) => {
    const columns = subjects.map(s => ({ component: props => <ShootInfo.SubjectCard {...props} subject={s} /> }));
    return { rowProps, columns };
  });
}
