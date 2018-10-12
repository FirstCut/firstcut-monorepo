
import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';

export default function GridView(props) {
  const { rows, gridProps } = props;
  return (
    <Grid stackable {...gridProps}>
      {
          rows.map((props, i) => {
            const reactKey = `${props.title}-${i}`;
            return (<Row key={reactKey} {...props} />);
          })
        }
    </Grid>
  );
}

function Row(props) {
  const { columns, rowProps } = props;
  const body = columns.map(col => <Col {...col} />);
  return (
    <Grid.Row {...rowProps}>
      {body}
    </Grid.Row>
  );
}

function Col(props) {
  const { colProps, component } = props;
  const Component = component;
  return (
    <Grid.Column {...colProps}>
      <Component className="fill-container" />
    </Grid.Column>
  );
}
