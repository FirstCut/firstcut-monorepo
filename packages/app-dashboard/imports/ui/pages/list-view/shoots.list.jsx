
import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import moment from 'moment';

import { _ } from 'lodash';
import ListViewTabs from '/imports/ui/components/utils/listview.tabs';
import withEditRecordModal from '../../containers/editrecord.container';
import withMultiRecord from '../../containers/multirecord.container';
import withFilters from '../../containers/filters.container';
import Cells from '../../components/utils/cells';
import { TableViewPage } from '../list.page';
import { getRelatedRecordPath } from 'firstcut-retrieve-url';
import { userExperience } from '/imports/ui/config';

export default function ShootsPage(props) {
  const { model } = props;
  const Shoot = model;
  const filterFields = [['projectId', 'isDummy', 'date']];
  const filterOverrides = {
    date: { hidden: true },
    isDummy: {
      sortBy: 'off',
      defaultValue: { $ne: true },
      options: () => List([
        { key: 'true', value: true, text: 'True' },
        { key: 'false', value: { $ne: true }, text: 'False' },
      ]),
    },
  };

  const CellComponent = (userExperience().isVideographer) ? Cells.PlainValue : Cells.Link;
  const listData = [
    { key: 'projectDisplayName', label: 'Project Name', display: <CellComponent getPath={record => getRelatedRecordPath('project', record)} /> },
    { key: 'companyDisplayName', label: 'Company', display: <CellComponent getPath={record => getRelatedRecordPath('company', record)} /> },
    { key: 'videographerDisplayName', label: Shoot.getFieldLabel('videographerId'), display: <CellComponent getPath={record => getRelatedRecordPath('videographer', record)} /> },
    { key: 'interviewerDisplayName', label: Shoot.getFieldLabel('interviewerId'), display: <CellComponent getPath={record => getRelatedRecordPath('interviewer', record)} /> },
    { key: 'cityDisplayName', label: Shoot.getFieldLabel('location.locality'), display: <Cells.PlainValue /> },
    { key: 'date', label: Shoot.getFieldLabel('date'), display: <Cells.DisplayDate /> },
  ];
  if (!userExperience().isVideographer) {
    listData.push(
      { key: 'invoiceCount', label: 'Invoice Count (should be > 0)', display: <Cells.PlainValue /> },
    );
  }

  const listOptions = {
    getRowProps(record) {
      return { positive: !record.isDummy };
    },
  };

  const pageProps = {
    filterFields, filterOverrides, listOptions, listData,
  };

  const today = moment().startOf('day').toDate();
  const panes = [
    {
      menuItem: 'Upcoming',
      render: () => {
        const Page = createListViewPage();
        return (
          <Page
            initialFilter={{ date: { $gte: moment().subtract(1, 'day').toDate() } }}
            {...pageProps}
            {...props}
          />
        );
      },
    },
    {
      menuItem: 'Past',
      render: () => {
        const Page = createListViewPage();
        return (
          <Page
            initialFilter={{ date: { $lt: today } }}
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
