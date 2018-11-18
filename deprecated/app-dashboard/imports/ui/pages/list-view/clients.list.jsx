
import React from 'react';
import PropTypes from 'prop-types';

import { _ } from 'lodash';
import withEditRecordModal from '../../containers/editrecord.container';
import withMultiRecord from '../../containers/multirecord.container';
import withFilters from '../../containers/filters.container';
import Cells from '../../components/utils/cells';
import { TableViewPage } from '../list.page';
import { getRelatedRecordPath } from 'firstcut-retrieve-url';

export default function ClientsPage(props) {
  const { model } = props;
  const Client = model;
  const filterFields = ['companyId'];

  const listData = [
    { key: 'displayName', label: 'Name', display: <Cells.PlainValue /> }, // TODO: Label should come from the new profile inmutable
    { key: 'companyDisplayName', label: Client.getFieldLabel('companyId'), display: <Cells.Link getPath={getRelatedRecordPath.bind(this, 'company')} /> },
    { key: 'phone', label: Client.getFieldLabel('phone'), display: <Cells.PlainValue /> },
    { key: 'email', label: Client.getFieldLabel('email'), display: <Cells.PlainValue /> },
    { key: 'hasUserProfile', label: 'Is Registered on App', display: <Cells.Bool /> },
  ];

  const Page = _.flowRight(withEditRecordModal, withFilters, withMultiRecord)(TableViewPage);
  return (<Page filterFields={filterFields} listData={listData} {...props} />);
}
