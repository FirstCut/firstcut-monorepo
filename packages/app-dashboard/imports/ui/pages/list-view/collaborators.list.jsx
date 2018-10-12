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

export default function CollaboratorsPage(props) {
  const { model } = props;
  const Collaborator = model;

  const filterFields = [
    ['skills', 'skills.$', 'location', 'location.locality', 'firstName', 'isActive'],
  ];
  const filterOverrides = {
    skills: {
      hidden: true,
    },
    location: {
      hidden: true,
    },
    administrative_area_level_1: {
      label: 'State',
    },
    isActive: {
      sortBy: 'off',
      options: () => List([
        {
          key: 'true',
          value: true,
          text: 'True',
        }, {
          key: 'false',
          value: false,
          text: 'False',
        },
      ]),
    },
  };

  const listData = [
    {
      key: 'fullName',
      label: 'Name',
      display: <Cells.PlainValue />,
    },
    // {key: 'typeLabel', label: Collaborator.getFieldLabel('type'), display: <Cells.PlainValue />},
    {
      key: 'phone',
      label: Collaborator.getFieldLabel('phone'),
      display: <Cells.PlainValue />,
    }, {
      key: 'email',
      label: Collaborator.getFieldLabel('email'),
      display: <Cells.PlainValue />,
    }, {
      key: 'cityDisplayName',
      label: Collaborator.getFieldLabel('location.locality'),
      display: <Cells.PlainValue />,
    }, {
      key: 'hasUserProfile',
      label: 'Is Registered on App',
      display: <Cells.Bool />,
    },
  ];

  const listOptions = {
    getRowProps(record) {
      return { positive: record.isActive };
    },
  };

  const pageProps = {
    filterFields, filterOverrides, listData, listOptions,
  };
  const panes = [
    {
      menuItem: 'Videographers',
      render: () => {
        const Page = createListViewPage();
        return (
          <Page
            initialFilter={filterForSkills(['CORPORATE_VIDEOGRAPHY'])}
            {...pageProps}
            {...props}
          />
        );
      },
    },
    {
      menuItem: 'Project Managers',
      render: () => {
        const Page = createListViewPage();
        return (
          <Page
            initialFilter={filterForSkills(['VIDEO_PROJECT_MANAGEMENT'])}
            {...pageProps}
            {...props}
          />
        );
      },
    },
    {
      menuItem: 'Editors',
      render: () => {
        const Page = createListViewPage();
        return (
          <Page
            initialFilter={filterForSkills(['MOTIONGRAPHICS', 'AUDIO_EDITING', 'VIDEO_EDITING'])}
            {...pageProps}
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
}

function filterForSkills(skills) {
  return {
    skills: {
      $elemMatch: {
        type: { $in: skills },
        isQualified: true,
      },
    },
  };
}

function createListViewPage() {
  return _.flowRight(withEditRecordModal, withFilters, withMultiRecord)(TableViewPage);
}
