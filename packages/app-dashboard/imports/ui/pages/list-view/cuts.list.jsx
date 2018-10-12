
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
import ListViewTabs from '/imports/ui/components/utils/listview.tabs';

export default function CutsListPage(props) {
  const { model } = props;
  const Cut = model;
  const filterFields = [['type', 'deliverableId', 'getLatestEvent', 'deliverableHasApprovedCut', 'isLatestCut']];
  const extendFilterSchema = { getLatestEvent: String, deliverableHasApprovedCut: Boolean, isLatestCut: Boolean };
  const filterOverrides = {
    getLatestEvent: { hidden: true },
    deliverableHasApprovedCut: { hidden: true },
    isLatestCut: { hidden: true },
  };
  const listData = [
    { key: 'deliverableDisplayName', label: Cut.getFieldLabel('deliverableId'), display: <Cells.Link getPath={getRelatedRecordPath.bind(this, 'deliverable')} /> },
    { key: 'typeLabel', label: Cut.getFieldLabel('type'), display: <Cells.PlainValue /> },
    { key: 'versionDisplayName', label: Cut.getFieldLabel('version'), display: <Cells.PlainValue /> },
    { key: 'createdAt', label: 'Submitted', display: <Cells.DisplayDate format="short" /> },
    { key: 'postpoOwnerDisplayName', label: 'PostProduction By', display: <Cells.Link getPath={getRelatedRecordPath.bind(this, 'postpoOwner')} /> },
  ];

  const pageProps = {
    filterFields, filterOverrides, listData, extendFilterSchema,
  };
  const panes = [
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
    {
      menuItem: 'Ready to Send To Client',
      render: () => {
        const Page = createListViewPage();
        return (
          <Page
            initialFilter={{ getLatestEvent: 'cut_uploaded', deliverableHasApprovedCut: false, isLatestCut: true }}
            {...pageProps}
            {...props}
          />
        );
      },
    },
    {
      menuItem: 'Pending feedback from client',
      render: () => {
        const Page = createListViewPage();
        return (
          <Page
            initialFilter={{ getLatestEvent: 'send_cut_to_client', deliverableHasApprovedCut: false, isLatestCut: true }}
            {...pageProps}
            {...props}
          />
        );
      },
    },
    {
      menuItem: 'Feedback Sent To Editor (new cut required)',
      render: () => {
        const Page = createListViewPage();
        return (
          <Page
            initialFilter={{ getLatestEvent: 'revisions_sent', deliverableHasApprovedCut: false, isLatestCut: true }}
            {...pageProps}
            {...props}
          />
        );
      },
    },
    {
      menuItem: 'Approved Cuts',
      render: () => {
        const Page = createListViewPage();
        return (
          <Page
            initialFilter={{ getLatestEvent: 'cut_approved_by_client' }}
            {...pageProps}
            {...props}
          />
        );
      },
    },
  ];

  return <ListViewTabs panes={panes} />;
}


function createListViewPage() {
  return _.flowRight(withEditRecordModal, withFilters, withMultiRecord)(TableViewPage);
}
