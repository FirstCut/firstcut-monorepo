
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

export default function ShootsPage(props) {

  const {model} = props;
  const Shoot = model;
  const filter_fields = [[ 'projectId','isDummy']];
  const filter_overrides = {
    'isDummy': {
      sortBy: 'off',
      options: ()=> {
        return List([
          {key:'true', value: true, text: 'True'},
          {key:'false', value: {"$ne": true}, text: 'False'}
        ]);
      }
    }
  };

  const list_data = [
    {key: 'projectDisplayName', label: 'Project Name', display: <Cells.Link getPath={getRelatedRecordPath.bind(this, 'project')} />},
    {key: 'companyDisplayName', label: 'Company', display: <Cells.Link getPath={getRelatedRecordPath.bind(this, 'company')} />},
    {key: 'videographerDisplayName', label: Shoot.getFieldLabel('videographerId'), display: <Cells.Link getPath={getRelatedRecordPath.bind(this, 'videographer')} />},
    {key: 'interviewerDisplayName', label: Shoot.getFieldLabel('interviewerId'), display: <Cells.Link getPath={getRelatedRecordPath.bind(this, 'interviewer')} />},
    {key: 'cityDisplayName', label: Shoot.getFieldLabel('location.locality'), display: <Cells.PlainValue />},
    {key: 'date', label: Shoot.getFieldLabel('date'), display: <Cells.DisplayDate />},
    {key: 'invoiceCount', label: 'Invoice Count (should be > 0)', display: <Cells.PlainValue />},
  ]

  const list_options = {
    getRowProps: function(record) {
      return {positive: !record.isDummy};
    }
  }

  const Page = _.flowRight(withEditRecordModal, withFilters, withMultiRecord)(TableViewPage);
  return (
    <Page
      filter_fields={filter_fields}
      filter_overrides={filter_overrides}
      list_data={list_data}
      list_options={list_options}
      {...props}/>
  );
}
