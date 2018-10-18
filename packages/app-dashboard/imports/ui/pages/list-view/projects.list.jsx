import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import { _ } from 'lodash';
import ListViewTabs from '/imports/ui/components/utils/listview.tabs';
import withEditRecordModal from '../../containers/editrecord.container';
import withMultiRecord from '../../containers/multirecord.container';
import withFilters from '../../containers/filters.container';
import Cells from '../../components/utils/cells';
import { TableViewPage } from '../list.page';
import { getRelatedRecordPath } from 'firstcut-retrieve-url';
import { userHasPermission, userExperience } from '/imports/ui/config';

export default function ProjectsList(props) {
  if (userExperience().isClient) {
    return <ClientsProjectsList {...props} />;
  }
  const { model } = props;
  const Project = model;
  const filterFields = [
    [
      'companyId', 'blueprint', 'isDummy',
    ],
    [],
  ];

  const filterOverrides = {
    isDummy: { hidden: true },
  };


  if (userHasPermission('LIST', 'Client')) {
    filterFields[1].push('clientOwnerId');
  }

  if (userHasPermission('LIST', 'Collaborator')) {
    filterFields[1].push('adminOwnerId');
  }

  const listData = [
    {
      key: 'displayName',
      label: Project.getFieldLabel('name'),
      display: <Cells.PlainValue />,
    }, {
      key: 'createdAt',
      label: 'Date created',
      display: <Cells.DisplayDate />,
    }, {
      key: 'companyDisplayName',
      label: Project.getFieldLabel('companyId'),
      display: <Cells.Link getPath={record => getRelatedRecordPath('company', record)} />,
    }, {
      key: 'blueprintLabel',
      label: Project.getFieldLabel('blueprint'),
      display: <Cells.PlainValue />,
    }, {
      key: 'latestKeyEventLabel',
      label: 'Stage',
      display: <Cells.PlainValue />,
    }, {
      key: 'clientOwnerDisplayName',
      label: Project.getFieldLabel('clientOwnerId'),
      display: <Cells.Link getPath={record => getRelatedRecordPath('clientOwner', record)} />,
    }, {
      key: 'adminOwnerDisplayName',
      label: Project.getFieldLabel('adminOwnerId'),
      display: <Cells.Link getPath={record => getRelatedRecordPath('adminOwner', record)} />,
    }, {
      key: 'invoiceCount',
      label: 'Invoice Count (should be > 0)',
      display: <Cells.PlainValue />,
    },
  ];

  const extendFilterSchema = { isWrapped: Boolean };
  const pageProps = {
    filterFields, filterOverrides, listData, extendFilterSchema,
  };

  const panes = [
    {
      menuItem: 'Active Projects',
      render: () => {
        const Page = createListViewPage();
        return (
          <Page
            initialFilter={{ isWrapped: false, isDummy: { $ne: true } }}
            {...pageProps}
            {...props}
          />
        );
      },
    },
    {
      menuItem: 'Wrapped Projects',
      render: () => {
        const Page = createListViewPage();
        return (
          <Page
            initialFilter={{ isWrapped: true, isDummy: { $ne: true } }}
            {...pageProps}
            {...props}
          />
        );
      },
    },
    {
      menuItem: 'Dummy Projects',
      render: () => {
        const Page = createListViewPage();
        return (
          <Page
            initialFilter={{ isDummy: true }}
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

function ClientsProjectsList(props) {
  const { model } = props;
  const Project = model;
  const listData = [
    {
      key: 'displayName',
      label: Project.getFieldLabel('name'),
      display: <Cells.PlainValue />,
    }, {
      key: 'latestKeyEventLabel',
      label: 'Stage',
      display: <Cells.PlainValue />,
    }, {
      key: 'adminOwnerDisplayName',
      label: 'Producer',
      display: <Cells.PlainValue />,
    },
  ];

  const Page = _.flowRight(withMultiRecord)(TableViewPage);
  return (<Page listData={listData} {...props} />);
}
