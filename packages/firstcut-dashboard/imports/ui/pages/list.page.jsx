import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';

import TableLayout from '../components/table-view/table.layout';
import asListPage from '../containers/listpage.container';
import Cells from '../components/utils/cells';
import { userExperience } from '/imports/ui/config';

export class TableViewPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.view = asListPage(Table);
  }

  render() {
    const View = this.view;
    const { listData, showUserActions, ...rest } = this.props;
    let withActions = listData;
    if (userExperience().isInternal) {
      withActions = [
        { key: 'actions', label: '', display: <Cells.Actions showUserActions={showUserActions} /> },
        ...listData,
      ];
    }
    return (
      <Container>
        <View {...rest} listData={withActions} />
      </Container>
    );
  }
}

function Table(props) {
  const {
    listData, records, listOptions, onSelect,
  } = props;
  return (<TableLayout columns={listData} rows={records} onSelectRow={onSelect} options={listOptions} />);
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
