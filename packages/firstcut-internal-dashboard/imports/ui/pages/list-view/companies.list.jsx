
import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import { _ } from 'lodash';
import withEditRecordModal from '../../containers/editrecord.container.jsx';
import withMultiRecord from '../../containers/multirecord.container.jsx';
import withFilters from '../../containers/filters.container.jsx';
import Cells from '../../components/utils/cells.jsx';
import { TableViewPage } from '../list.page.jsx';
import { getRelatedRecordPath } from 'firstcut-retrieve-url';

export default function CompaniesPage(props) {

  const {model} = props;
  const Company = model;
  const filter_fields = [];

  const list_data = [
    {key: 'displayName', label: Company.getFieldLabel('name'), display: <Cells.PlainValue />},
    {key: 'website', label: Company.getFieldLabel('website'), display: <Cells.PlainValue />}
  ]

  const Page = _.flowRight(withEditRecordModal, withFilters, withMultiRecord)(TableViewPage);
  return ( <Page filter_fields={filter_fields} list_data={list_data} {...props}/>);
}
