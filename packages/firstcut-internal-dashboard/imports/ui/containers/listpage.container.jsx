
import React from 'react';
import PropTypes from 'prop-types';
import { List, Stack, Record } from 'immutable';
import { Button, Container, Header } from 'semantic-ui-react';
import { getRecordPath, getRecordUrl } from 'firstcut-retrieve-url';

import { userHasPermission } from '/imports/ui/config';
import Buttons from '../components/utils/buttons.jsx';
import { Autoform } from 'firstcut-react-autoform';

export default function asListPage(WrappedComponent) {
  return function ListView(props) {
    _onSelectRow = record => (e)=> {
      if (e.type == 'contextmenu') {
        window.open(getRecordPath(record));
      } else {
        props.history.push(getRecordPath(record));
      }
    }

    const canEditRecord = props.editRecord && userHasPermission({verb: 'WRITE', target: props.model.model_name});
    return (
      <Container>
        { canEditRecord && <NewRecordButton {...props} />}
        { props.filter && <FiltersSection {...props} /> }
        <Header>Number of records: {props.records.count()}</Header>
        <WrappedComponent onSelect={this._onSelectRow} {...props} />
      </Container>
    )
  }
}

asListPage.propTypes = {
  editRecord: PropTypes.func,
  model: PropTypes.func,
  filter: PropTypes.instanceOf(Record),
  clearFilters: PropTypes.func,
  onSelectRecord: PropTypes.func,
  applyFilter: PropTypes.func,
  getRecordPath: PropTypes.func,
  filter_fields: PropTypes.arrayOf(
    PropTypes.oneOfType(
      [PropTypes.string, PropTypes.arrayOf(PropTypes.string)]
    )),
  list_options: PropTypes.shape({
    getRowProps: PropTypes.func
  }),
  list_data: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    label: PropTypes.string,
    display: PropTypes.node,
    })
  ),
  records: PropTypes.instanceOf(List),
};


function NewRecordButton(props){
  return <Buttons.AddNew key='new' onClick={props.editRecord(props.model.createNew({}))} />;
}

export function FiltersSection(props) {
  return (
    <Container>
      <ClearFilters {...props}/>
      <Filters {...props}/>
    </Container>
  )
}

function ClearFilters(props){
  return <Button key='clear' onClick={props.clearFilters}>Clear Filters</Button>;
}

function Filters(props) {
  const {filter, filter_fields, applyFilter, filter_overrides} = props;
  return (
    <Autoform
      key='filters'
      record={ filter }
      fields={ filter_fields }
      overrides={ filter_overrides }
      disable_defaults={ true }
      onChange={ applyFilter }
    />
  )
}
