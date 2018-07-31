
import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';

export default function GridView(props) {
  const {rows, grid_props } = props;
  return (
    <Grid centered stackable {...grid_props}>
        {
          rows.map((props, i)=> {
            const react_key = `${props.title}-${i}`;
            return (<Row key={react_key} {...props} />);
          })
        }
    </Grid>
  )
}

function Row(props) {
  const { columns, row_props } = props;
  const body = columns.map(col => <Col {...col}/>);
  return <Grid.Row {...row_props}>{body}</Grid.Row>;
}

function Col(props) {
  const { col_props, component } = props;
  const Component = component;
  return (<Grid.Column {...col_props} ><Component className='fill-container' /></Grid.Column>);
}
