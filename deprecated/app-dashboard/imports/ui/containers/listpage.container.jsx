
import React from 'react';
import PropTypes from 'prop-types';
import { List, Record } from 'immutable';
import { Button, Container, Header } from 'semantic-ui-react';
import { getRecordPath } from 'firstcut-retrieve-url';

import { userHasPermission, userExperience } from '/imports/ui/config';
import { Autoform } from 'firstcut-react-autoform';
import Buttons from '../components/utils/buttons';

export default function asListPage(WrappedComponent) {
  return function ListView(props) {
    const _onSelectRow = record => (e) => {
      const { history } = props;
      if (e.type === 'contextmenu') {
        window.open(getRecordPath(record));
      } else {
        history.push(getRecordPath(record));
      }
    };

    const {
      filter, records, model, editRecord,
    } = props;
    const canCreateRecord = editRecord && userHasPermission({ verb: 'CREATE', target: model.modelName });
    return (
      <Container>
        { canCreateRecord && <NewRecordButton {...props} />}
        { filter && <FiltersSection {...props} /> }
        { !userExperience().isClient
          && (
          <Header>
          Number of records:
            { records.count() }
          </Header>
          )
        }
        <WrappedComponent {...props} onSelect={(userExperience().isExternal) ? _onSelectRow : () => {}} />
      </Container>
    );
  };
}

asListPage.propTypes = {
  editRecord: PropTypes.func,
  model: PropTypes.func,
  filter: PropTypes.instanceOf(Record),
  clearFilters: PropTypes.func,
  onSelectRecord: PropTypes.func,
  applyFilter: PropTypes.func,
  getRecordPath: PropTypes.func,
  filterFields: PropTypes.arrayOf(
    PropTypes.oneOfType(
      [PropTypes.string, PropTypes.arrayOf(PropTypes.string)],
    ),
  ),
  listOptions: PropTypes.shape({
    getRowProps: PropTypes.func,
  }),
  listData: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    label: PropTypes.string,
    display: PropTypes.node,
  })),
  records: PropTypes.instanceOf(List),
};


function NewRecordButton(props) {
  const { editRecord, model } = props;
  return <Buttons.AddNew key="new" onClick={editRecord(model.createNew({}))} />;
}

export function FiltersSection(props) {
  return (
    <Container>
      <ClearFilters {...props} />
      <Filters {...props} />
    </Container>
  );
}

function ClearFilters(props) {
  const { clearFilters } = props;
  return (
    <Button key="clear" onClick={clearFilters}>
      Clear Filters
    </Button>
  );
}

function Filters(props) {
  const {
    filter, filterFields, applyFilter, filterOverrides,
  } = props;
  return (
    <Autoform
      key="filters"
      record={filter}
      fields={filterFields}
      overrides={filterOverrides}
      onChange={applyFilter}
    />
  );
}
