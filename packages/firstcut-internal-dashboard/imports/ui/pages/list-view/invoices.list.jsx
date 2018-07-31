
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

export default function InvoicesListPage(props) {

  const { model } = props;
  const Invoice = model;
  const filter_fields = [['payeeId','type','status']];

  const list_data = [
    {key: 'type', label: Invoice.getFieldLabel('type'), display: <Cells.PlainValue />},
    {key: 'gigDisplayName', label: Invoice.getFieldLabel('gigId'), display: <Cells.PlainValue />},
    {key: 'payeeDisplayName', label: Invoice.getFieldLabel('payeeId'), display: <Cells.PlainValue />},
    {key: 'note', label: Invoice.getFieldLabel('note'), display: <Cells.PlainValue />},
    {key: 'amount', label: Invoice.getFieldLabel('amount'), display: <Cells.USDollars />},
    {key: 'statusLabel', label: Invoice.getFieldLabel('status'), display: <Cells.PlainValue />},
    {key: 'datePaid', label: Invoice.getFieldLabel('date_paid'), display: <Cells.DisplayDate format='clean'/>},
  ]

  const Page = _.flowRight(withEditRecordModal, withFilters, withMultiRecord)(TableViewPage);
  return ( <Page filter_fields={filter_fields} list_data={list_data} {...props}/>);
}
