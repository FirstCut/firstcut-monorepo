
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

export default function CutsListPage(props) {

  const {model} = props;
  const Cut = model;
  const filter_fields = [['type','deliverableId']];
  const list_data = [
    {key: 'deliverableDisplayName', label: Cut.getFieldLabel('deliverableId'), display: <Cells.Link getPath={getRelatedRecordPath.bind(this, 'deliverable')} />},
    {key: 'typeLabel', label: Cut.getFieldLabel('type'), display: <Cells.PlainValue />},
    {key: 'versionDisplayName', label: Cut.getFieldLabel('version'), display: <Cells.PlainValue />},
    {key: 'createdAt', label: 'Submitted', display: <Cells.DisplayDate format='short'/>},
    {key: 'postpoOwnerDisplayName', label: 'PostProduction By', display: <Cells.Link getPath={getRelatedRecordPath.bind(this, 'postpoOwner')} />},
  ]

  const Page = _.flowRight(withEditRecordModal, withFilters, withMultiRecord)(TableViewPage);
  return ( <Page filter_fields={filter_fields} list_data={list_data} {...props}/>);
}
