
import React from 'react';
import PropTypes from 'prop-types';

import { _ } from 'lodash';
import ListViewTabs from '/imports/ui/components/utils/listview.tabs';
import withEditRecordModal from '../../containers/editrecord.container';
import withMultiRecord from '../../containers/multirecord.container';
import withFilters from '../../containers/filters.container';
import Cells from '../../components/utils/cells';
import { TableViewPage } from '../list.page';
import { userHasPermission } from '/imports/ui/config';
import { getRelatedRecordPath } from 'firstcut-retrieve-url';

export default function InvoicesListPage(props) {
  const { model } = props;
  const Invoice = model;
  const filterFields = [['type', 'status']];
  if (userHasPermission('LIST', 'Collaborator')) {
    filterFields[0].push('payeeId');
  }

  const listData = [
    { key: 'statusLabel', label: Invoice.getFieldLabel('status'), display: <Cells.PlainValue /> },
    { key: 'type', label: Invoice.getFieldLabel('type'), display: <Cells.PlainValue /> },
    { key: 'gigDisplayName', label: Invoice.getFieldLabel('gigId'), display: <Cells.Link getPath={record => getRelatedRecordPath('gig', record)} /> },
    { key: 'payeeDisplayName', label: Invoice.getFieldLabel('payeeId'), display: <Cells.Link getPath={record => getRelatedRecordPath('payee', record)} /> },
    { key: 'note', label: Invoice.getFieldLabel('note'), display: <Cells.PlainValue /> },
    { key: 'amount', label: Invoice.getFieldLabel('amount'), display: <Cells.USDollars /> },
  ];

  const pageProps = {
    filterFields, listData,
  };

  const panes = [
    {
      menuItem: 'Due',
      render: () => {
        const Page = createListViewPage();
        const data = { ...pageProps };
        data.listData = data.listData.concat([
          { key: 'dateDue', label: Invoice.getFieldLabel('date_due'), display: <Cells.DisplayDate format="clean" /> },
          { key: 'payeePaymentMethodAsString', label: 'Payment Methods', display: <Cells.PlainValue /> },
        ]);
        return (
          <Page
            initialFilter={{ status: 'DUE' }}
            showUserActions
            {...data}
            {...props}
          />
        );
      },
    },
    {
      menuItem: 'Not yet due',
      render: () => {
        const Page = createListViewPage();
        return (
          <Page
            initialFilter={{ status: 'NOT_DUE' }}
            showUserActions
            {...pageProps}
            {...props}
          />
        );
      },
    },
    {
      menuItem: 'Paid',
      render: () => {
        const Page = createListViewPage();
        const data = { ...pageProps };
        data.listData = data.listData.concat([
          { key: 'datePaid', label: Invoice.getFieldLabel('date_paid'), display: <Cells.DisplayDate format="clean" /> },
          { key: 'transactionId', label: Invoice.getFieldLabel('transactionId'), display: <Cells.PlainValue /> },
        ]);
        return (
          <Page
            initialFilter={{ status: 'PAID' }}
            {...data}
            {...props}
          />
        );
      },
    },
    {
      menuItem: 'All',
      render: () => {
        const Page = createListViewPage();
        return (
          <Page
            {...pageProps}
            {...props}
          />
        );
      },
    },
  ];
  // return (<Page filterFields={filterFields} filterOverrides={filterOverrides} listData={listData} listOptions={listOptions} {...props} />);
  return <ListViewTabs panes={panes} />;

  // const Page = _.flowRight(withEditRecordModal, withFilters, withMultiRecord)(TableViewPage);
  // return (<Page filterFields={filterFields} listData={listData} {...props} />);
}

function createListViewPage() {
  return _.flowRight(withEditRecordModal, withFilters, withMultiRecord)(TableViewPage);
}
