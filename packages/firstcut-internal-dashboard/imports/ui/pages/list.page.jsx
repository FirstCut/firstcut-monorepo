import React from 'react';
import PropTypes from 'prop-types';
import { List, Stack, Record } from 'immutable';
import { Form, Button, Container } from 'semantic-ui-react';

import Buttons from '../components/utils/buttons.jsx';
import TableLayout from '../components/table-view/table.layout.jsx';
import CardsView from '../components/table-view/table.layout.jsx';
import GridView from '../components/grid-view/grid.layout.jsx';
import { Autoform } from 'firstcut-react-autoform';
import asListPage from '../containers/listpage.container.jsx';

export class TableViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.view = asListPage(Table);
  }
  render() {
    const View = this.view;
    return (
      <Container>
        <View {...this.props} />
      </Container>
    )
  }
}

function Table(props) {
  const {list_data, records, list_options, onSelect} = props;
  return (<TableLayout columns={list_data} rows={records} onSelectRow={onSelect} options={list_options}/>);
}

// export function GridViewPage(props) {
//   const { item_view, item_props, records } = props;
//   const Item = item_view;
//   const items = records.map(r => <Item record={r} {...item_props}/>);
//   const View = asListPage(GridView);
//   return (
//     <Container>
//       <View items={items} {...props}/>
//     </Container>
//   )
// }
