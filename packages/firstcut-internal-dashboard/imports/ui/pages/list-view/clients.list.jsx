
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
import { hasUserProfile } from 'firstcut-utils';

export default function ClientsPage(props) {

  const {model} = props;
  const Client = model;
  const filter_fields = ['companyId'];

  const list_data = [
    {key: 'displayName', label: 'Name', display: <Cells.PlainValue />}, //TODO: Label should come from the new profile inmutable
    {key: 'companyDisplayName', label: Client.getFieldLabel('companyId'), display: <Cells.Link getPath={getRelatedRecordPath.bind(this, 'company')} />},
    {key: 'phone', label: Client.getFieldLabel('phone'), display: <Cells.PlainValue />},
    {key: 'email', label: Client.getFieldLabel('email'), display: <Cells.PlainValue />},
    {key: 'hasUserProfile', label: 'Is Registered on App', display: <Cells.FetchAsync func={({record}, cb) => hasUserProfile.call({playerEmail: record.email}, cb)}/>},
  ]

  const Page = _.flowRight(withEditRecordModal, withFilters, withMultiRecord)(TableViewPage);
  return ( <Page filter_fields={filter_fields} list_data={list_data} {...props}/>);
}
