
import React from 'react';
import PropTypes from 'prop-types';
import { Models } from 'firstcut-models';
import { PubSub } from 'pubsub-js';
import { List, Map } from 'immutable';
import { getSignedUrl, getSignedCookies } from 'firstcut-s3';

export default function withFileManager(WrappedComponent) {
  return class extends React.Component {
    state = {
      name_to_id: new Map(),
      in_progress: false,
      progress: 0,
      docs: []
    }

    setToInProgress = () => this.setState({in_progress: true});
    setProgress = (p) => this.setState({progress: p});
    setToNotInProgress = () => this.setState({in_progress: false, progress: 0});

    onValueChange = (new_value) => {
      const {fieldname, onChange, save_event} = this.props;
      if (onChange) {
        onChange(null, {name: fieldname, value: new_value});
      }
      if (save_event) {
        PubSub.publish(save_event);
      }
    }

    fileError = (error) => {
      alert(error);
      this.setToNotInProgress();
    }

    fileUploadSuccess = (file_obj) => {
      this.notifyFileAdded(file_obj);
      const name_to_id = this.state.name_to_id.set(file_obj.name, file_obj._id);
      this.setState({name_to_id});
      this.setToNotInProgress();
    }

    notifyFileAdded = (file_obj) => {
      if (!this.props.onChange) {
          return;
      }
      const {record, fieldname} = this.props;
      const accepts_multiple_files = getAcceptsMultipleFiles(record, fieldname);
      if (accepts_multiple_files) {
        const new_field_value = getFileIds(record, fieldname);
        new_field_value.push(file_obj._id);
        this.onValueChange(new_field_value);
      } else {
        const previous_id = getFileIds(record, fieldname)[0];
        // if (previous_id) {
        //   const store = getFileStore(record, fieldname);
        //   removeFileWithId(previous_id, store);
        // }
        this.onValueChange(file_obj._id);
      }
    }

    onFileRemoved = (file) => {
      const {record, fieldname} = this.props;
      const store = getFileStore(record, fieldname);
      const file_id = (file._id)? file._id : this.state.name_to_id.get(file.name);
      // removeFileWithId(file_id, store);
      this.notifyFileRemoved(file_id);
    }

    notifyFileRemoved = (file_id) => {
      const {record, fieldname} = this.props;
      const file_ids = getFileIds(record, fieldname);
      const new_field_value = file_ids.filter(id => id != file_id);
      this.onValueChange(new_field_value);
    }

    onFileAdded = (file) => {
      const {record, fieldname} = this.props;
      const file_options = {
        file: file,
        streams: 'dynamic',
        chunkSize: 'dynamic',
        meta: {
          root: record.filesRoot(fieldname),
          bucket: getFileBucket(record, fieldname)
        },
        allowWebWorkers: true
      }
      const result = Models.Asset.insert(file_options);
      const {emitter} = result;
      emitter.on('error', this.fileError);
      emitter.on('uploaded', this.fileUploadSuccess.bind(this, result.record));
      emitter.on('progress', (progress) => {
        this.setProgress(progress);
      });
      this.setToInProgress();
    }

    async fetchDocuments({fieldname, record}) {
      const docs = await getFileDocuments(record, fieldname);
      this.setState({docs});
    }

    componentDidMount() {
      this.fetchDocuments(this.props);
    }

    shouldComponentUpdate(next_props, props) {
      if (props.fieldname != next_props.fieldname || props.record != next_props.record) {
        return true;
      }
      return false;
    }

    render() {
      const {record, fieldname} = this.props;
      return (
        <WrappedComponent
          onFileAdded={this.onFileAdded}
          onFileRemoved={this.onFileRemoved}
          files={this.state.docs}
          progress={this.state.progress}
          in_progress={this.state.in_progress}
          {...this.props}
        />
      )
    }

  }
}

function getFileDocuments(record, fieldname) {
  const store = getFileStore(record, fieldname);
  const ids = getFileIds(record, fieldname);
  console.log(ids);
  const promises = ids.map(async id => {
    return new Promise((resolve, reject) => {
      // getSignedCookies.call({file_ref:f}, (err, result) => {
      //   cookies.set('CloudFront-Key-Pair-Id', result['CloudFront-Key-Pair-Id']);
      //   cookies.set('CloudFront-Policy', result['CloudFront-Policy']);
      //   cookies.set('CloudFront-Signature', result['CloudFront-Signature']);
      // });
      getSignedUrl.call({file_id: id, version: record.fileVersion}, (err, url) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          let file = Models.Asset.fromId(id);
          file.url = url;
          console.log(file);
          resolve(file);
        }
      });
    });
  });

  return Promise.all(promises);
}

function removeFileWithId(id, store) {
  store.remove.call(id, (err, res) => {
    if (err) {
      alert(err);
    }
  });
}

function isFileField(record, fieldname) {
  const fieldtype = getFieldCustomType(record, fieldname);
  return fieldtype == 'fileArray' || fieldtype == 'file';
}

function getAcceptsMultipleFiles(record, fieldname) {
  const fieldtype = getFieldCustomType(record, fieldname);
  return fieldtype == 'fileArray';
}

function getFileStore(record, fieldname) {
  return Models.Asset;
}

function getFileBucket(record, fieldname) {
  const schema_bucket = record.schema.getFieldSchema(fieldname).bucket;
  return (schema_bucket) ? schema_bucket : Meteor.settings.public.s3.assets_bucket;
}

function getFieldCustomType(record, fieldname) {
  return record.schema.getFieldSchema(fieldname).customType;
}

function getFileIds(record, fieldname) {
  const fieldvalue = record[fieldname];
  if (fieldvalue instanceof List) {
    return fieldvalue.toArray();
  } else if (!fieldvalue) {
    return [];
  } else if (fieldvalue instanceof Array) {
    return fieldvalue;
  } else if (typeof fieldvalue == 'string') {
    return [record[fieldname]];
  } else {
    throw new Meteor.Error('invalid-params', 'FileManager requires array, list, or string field');
  }
}
