import React from 'react';
import PropTypes from 'prop-types';
import {List} from 'immutable';

import {_} from 'lodash';
import withEditRecordModal from '../../containers/editrecord.container.jsx';
import withMultiRecord from '../../containers/multirecord.container.jsx';
import withFilters from '../../containers/filters.container.jsx';
import Cells from '../../components/utils/cells.jsx';
import {TableViewPage} from '../list.page.jsx';
import {getRelatedRecordPath} from 'firstcut-retrieve-url';

export default function ProjectsList(props) {

  const {model} = props;
  const Project = model;
  const filter_fields = [
    [
      'companyId', 'clientOwnerId'
    ],
    [
      'adminOwnerId', 'blueprint'
    ],
    ['stage', 'isDummy']
  ];

  const filter_overrides = {
    'isDummy': {
      sortBy: 'off',
      options: () => {
        return List([
          {
            key: 'true',
            value: true,
            text: 'True'
          }, {
            key: 'false',
            value: {
              "$ne": true
            },
            text: 'False'
          }
        ]);
      }
    }
  };

  const list_data = [
    {
      key: 'displayName',
      label: Project.getFieldLabel('name'),
      display: <Cells.PlainValue/>
    }, {
      key: 'companyDisplayName',
      label: Project.getFieldLabel('companyId'),
      display: <Cells.Link getPath={getRelatedRecordPath.bind(this, 'company')}/>
    }, {
      key: 'blueprintLabel',
      label: Project.getFieldLabel('blueprint'),
      display: <Cells.PlainValue/>
    }, {
      key: 'stageLabel',
      label: Project.getFieldLabel('stage'),
      display: <Cells.PlainValue/>
    }, {
      key: 'clientOwnerDisplayName',
      label: Project.getFieldLabel('clientOwnerId'),
      display: <Cells.Link getPath={getRelatedRecordPath.bind(this, 'clientOwner')}/>
    }, {
      key: 'adminOwnerDisplayName',
      label: Project.getFieldLabel('adminOwnerId'),
      display: <Cells.Link getPath={getRelatedRecordPath.bind(this, 'adminOwner')}/>
    }, {
      key: 'invoiceCount',
      label: 'Invoice Count (should be > 0)',
      display: <Cells.PlainValue />
    }
  ]

  const Page = _.flowRight(withEditRecordModal, withFilters, withMultiRecord)(TableViewPage);
  return (<Page filter_fields={filter_fields} filter_overrides={filter_overrides} list_data={list_data} {...props}/>);
}
