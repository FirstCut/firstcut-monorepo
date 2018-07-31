
import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import { _ } from 'lodash';
import withEditRecordModal from '../../containers/editrecord.container.jsx';
import withMultiRecord from '../../containers/multirecord.container.jsx';
import withFilters from '../../containers/filters.container.jsx';
import { asLink } from '../../components/utils/utils.jsx';
import Cells from '../../components/utils/cells.jsx';
import Cards from '../../components/utils/cards.jsx';
import { TableViewPage, GridViewPage } from '../list.page.jsx';
import { getRelatedRecordPath, getRecordPath } from 'firstcut-retrieve-url';

const filter_fields = [
  ['clientOwnerId','postpoOwnerId'],
  ['projectId']
];

export function DeliverablesTablePage(props) {

  const {model} = props;
  const Deliverable = model;

  const list_data = [
    {key: 'projectDisplayName', label: Deliverable.getFieldLabel('projectId'), display: <Cells.PlainValue />},
    {key: 'displayName', label: 'Name', display: <Cells.PlainValue />},
    {key: 'postpoOwnerDisplayName', label: Deliverable.getFieldLabel('postpoOwnerId'), display: <Cells.Link getPath={getRelatedRecordPath.bind(this, 'postpoOwner')} />},
    {key: 'adminOwnerDisplayName', label: 'Admin Owner', display: <Cells.Link getPath={getRelatedRecordPath.bind(this, 'adminOwner')} />},
    {key: 'invoiceCount', label: 'Invoice Count (should be > 0)', display: <Cells.PlainValue />},
  ]

  const Page = _.flowRight(withEditRecordModal, withFilters, withMultiRecord)(TableViewPage);
  return ( <Page filter_fields={filter_fields} list_data={list_data} {...props}/>);
}

// export function DeliverablesCardsPage(props) {
//   const LinkCard = asLink(Cards.Deliverable);
//   const Page = _.flowRight(withEditRecordModal, withFilters, withMultiRecord)(GridViewPage);
//   return ( <Page filter_fields={filter_fields} item_view={LinkCard} item_props={{getPath:getRecordPath}} {...props}/>);
// }
