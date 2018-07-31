import React from 'react';
import PropTypes from 'prop-types';
import {List} from 'immutable';

import {_} from 'lodash';
import withEditRecordModal from '../../containers/editrecord.container.jsx';
import withMultiRecord from '../../containers/multirecord.container.jsx';
import withFilters from '../../containers/filters.container.jsx';
import Cells from '../../components/utils/cells.jsx';
import {TableViewPage} from '../list.page.jsx';
import {hasUserProfile} from 'firstcut-utils';

export default function CollaboratorsPage(props) {

  const {model} = props;
  const Collaborator = model;

  const filter_fields = [
    ['location', 'location.locality', 'firstName', 'isActive']
  ];
  const filter_overrides = {
    'location': {
      hidden: true
    },
    'administrative_area_level_1': {
      label: 'State'
    },
    'isActive': {
      sortBy: 'off',
      options: () => {
        return List([
          {
            key: 'true',
            value: true,
            text: 'True'
          }, {
            key: 'false',
            value: false,
            text: 'False'
          }
        ]);
      }
    }
  };

  const list_data = [
    {
      key: 'fullName',
      label: 'Name',
      display: <Cells.PlainValue/>
    },
    // {key: 'typeLabel', label: Collaborator.getFieldLabel('type'), display: <Cells.PlainValue />},
    {
      key: 'phone',
      label: Collaborator.getFieldLabel('phone'),
      display: <Cells.PlainValue/>
    }, {
      key: 'email',
      label: Collaborator.getFieldLabel('email'),
      display: <Cells.PlainValue/>
    }, {
      key: 'cityDisplayName',
      label: Collaborator.getFieldLabel('location.locality'),
      display: <Cells.PlainValue/>
    }, {
      key: 'hasUserProfile',
      label: 'Is Registered on App',
      display: <Cells.FetchAsync func={({
          record
        }, cb) => hasUserProfile.call({
          playerEmail: record.email
        }, cb)}/>
    }
  ]

  const list_options = {
    getRowProps: function(record) {
      return {positive: record.isActive};
    }
  }

  const Page = _.flowRight(withEditRecordModal, withFilters, withMultiRecord)(TableViewPage);
  return (<Page filter_fields={filter_fields} filter_overrides={filter_overrides} list_data={list_data} list_options={list_options} {...props}/>);
}
