
import React from 'react';
import PropTypes from 'prop-types';

import { _ } from 'lodash';
import ListViewTabs from '/imports/ui/components/utils/listview.tabs';
import withEditRecordModal from '../../containers/editrecord.container';
import withMultiRecord from '../../containers/multirecord.container';
import withFilters from '../../containers/filters.container';
import Cells from '../../components/utils/cells';
import { TableViewPage } from '../list.page';
import { getRelatedRecordPath } from 'firstcut-retrieve-url';
import { userHasPermission } from '/imports/ui/config';

export function DeliverablesTablePage(props) {
  const { model } = props;
  const Deliverable = model;
  const filterFields = [
    ['projectId'],
  ];

  if (userHasPermission('LIST', 'Client')) {
    filterFields[0].push('clientOwnerId');
  }
  if (userHasPermission('LIST', 'Collaborator')) {
    filterFields[0].push('postpoOwnerId');
  }

  const listData = [
    { key: 'projectDisplayName', label: Deliverable.getFieldLabel('projectId'), display: <Cells.PlainValue /> },
    { key: 'displayName', label: 'Name', display: <Cells.PlainValue /> },
    { key: 'postpoOwnerDisplayName', label: Deliverable.getFieldLabel('postpoOwnerId'), display: <Cells.Link getPath={record => getRelatedRecordPath('postpoOwner', record)} /> },
    { key: 'adminOwnerDisplayName', label: 'Admin Owner', display: <Cells.Link getPath={record => getRelatedRecordPath('adminOwner', record)} /> },
    { key: 'invoiceCount', label: 'Invoice Count (should be > 0)', display: <Cells.PlainValue /> },
  ];

  const extendFilterSchema = { isWrapped: Boolean };
  const pageProps = {
    filterFields, listData, extendFilterSchema,
  };

  const panes = [
    {
      menuItem: 'Active',
      render: () => {
        const Page = createListViewPage();
        return (
          <Page
            initialFilter={{ isWrapped: false }}
            {...pageProps}
            {...props}
          />
        );
      },
    },
    {
      menuItem: 'Wrapped',
      render: () => {
        const Page = createListViewPage();
        return (
          <Page
            initialFilter={{ isWrapped: true }}
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
