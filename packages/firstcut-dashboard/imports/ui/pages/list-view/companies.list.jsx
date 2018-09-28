
import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import { _ } from 'lodash';
import withEditRecordModal from '../../containers/editrecord.container';
import withMultiRecord from '../../containers/multirecord.container';
import withFilters from '../../containers/filters.container';
import Cells from '../../components/utils/cells';
import { TableViewPage } from '../list.page';
import { getRelatedRecordPath } from 'firstcut-retrieve-url';

export default function CompaniesPage(props) {

  const {model} = props;
  const Company = model;
  const filterFields = [];

  const listData = [
    {key: 'displayName', label: Company.getFieldLabel('name'), display: <Cells.PlainValue />},
    {key: 'website', label: Company.getFieldLabel('website'), display: <Cells.PlainValue />}
  ]

  const Page = _.flowRight(withEditRecordModal, withFilters, withMultiRecord)(TableViewPage);
  return ( <Page filterFields={filterFields} listData={listData} {...props}/>);
}
