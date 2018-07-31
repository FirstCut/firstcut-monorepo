
import React from 'react';
import PropTypes from 'prop-types';
import { Record, List } from 'immutable';
import { Form, Progress, Label } from 'semantic-ui-react';
import DropzoneComponent from 'react-dropzone-component';
import { withFileManager } from 'firstcut-filestore';
import {removeNonDomFields} from '../autoform.utils.js';

function ProgressBar(props) {
  return <Progress percent={props.percent} indicating />;
}

export default class Dropzone extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    const Enabled = withFileManager(PrivateDropzoneComponent);
    return <Enabled {...this.props} />
  }
}

class PrivateDropzoneComponent extends React.Component {

  render() {
    const { onFileAdded, onFileRemoved, record, in_progress, progress, label, ...field_options } = this.props;

    field_options.config = {
      showFiletypeIcon: true,
      postUrl: '/stubUrl'
    };
    field_options.eventHandlers = {
      addedfile: onFileAdded,
      removedfile: onFileRemoved
    }
    field_options.djsConfig = {
      addRemoveLinks: true
    }

    const drop_props = removeNonDomFields(field_options);
    return (
      <div>
        { in_progress && <ProgressBar percent={progress} label='Uploading...'/> }
        <Label>{label}</Label>
        <DropzoneComponent {...field_options}/>
      </div>
    )
  }
}
