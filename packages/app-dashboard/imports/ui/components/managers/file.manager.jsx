
import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import Models from '/imports/api/models';
import { PubSub } from 'pubsub-js';
import { List, Map } from 'immutable';
import { getSignedUrl } from '/imports/api/filestore';
import { _ } from 'lodash';
import Analytics from 'firstcut-analytics';
import { userExperience, USER_IS_UPLOADING, UPLOAD_SUCCESSFUL } from '/imports/ui/config';

export default function withFileManager(WrappedComponent) {
  class WithFileManager extends React.Component {
    state = {
      nameToId: new Map(),
      fileStats: new Map(),
      records: new List(),
      uploadComplete: false,
      docs: [],
    }

    componentDidMount() {
      this.fetchDocuments(this.props);
    }

    shouldComponentUpdate(nextProps, props) {
      const { fieldname, record } = props;
      if (fieldname !== nextProps.fieldname || record !== nextProps.record) {
        return true;
      }
      return false;
    }

    onValueChange = (newValue) => {
      const { fieldname, onChange, saveEvent } = this.props;
      if (onChange) {
        onChange(null, { name: fieldname, value: newValue });
      }
      if (saveEvent) {
        PubSub.publish(saveEvent);
      }
    };

    onFileRemoved = (file) => {
      const { nameToId } = this.state;
      const fileId = (file._id) ? file._id : nameToId.get(file.name);
      this.notifyFileRemoved(fileId);
    };

    onFileAdded = (file, path = '') => {
      PubSub.publish(USER_IS_UPLOADING, true);
      Analytics.trackUploadEvent({ filename: file.name });
      if (userExperience().isVideographer) {
        Meteor.disconnect();
      }
      const { record, fieldname } = this.props;
      const root = (path) ? `${record.filesRoot(fieldname)}/${path}` : record.filesRoot(fieldname);
      const fileOptions = {
        file,
        streams: 'dynamic',
        chunkSize: 'dynamic',
        meta: {
          root,
          bucket: getFileBucket(record, fieldname),
        },
        allowWebWorkers: true,
      };
      // Models.Asset.createNew({}); // stub asset to ensure the collection is initialized
      const assetRecord = Models.Asset.createNew({});
      const { emitter, asset } = assetRecord.upload(fileOptions);
      emitter.on('error', this.fileError);
      emitter.on('uploaded', this.fileUploadSuccess(asset));
      emitter.on('progress', (progress, stats) => {
        this.setState((state, props) => {
          const fileStats = this.setFileStats(state, file.name, { progress, ...stats });
          return { fileStats };
        });
      });

      this.setState((state, props) => {
        const fileStats = this.setFileStats(state, file.name, { progress: 0 });
        return { uploadComplete: false, fileStats };
      });
    };

    setFileStats = (state, filename, stats) => {
      let { fileStats } = state;
      fileStats = fileStats.set(filename, { fileStats, ...stats });
      return fileStats;
    };

    fileError = (error) => {
      console.log(error);
    };

    fileUploadSuccess = asset => (awsKey) => {
      this.setState((state, props) => {
        let {
          records, nameToId, uploadComplete,
        } = state;
        asset = asset.setPath('original', awsKey);
        records = records.push(asset);
        nameToId = nameToId.set(asset.name, asset._id);
        this.notifyFileAdded(asset);
        const fileStats = this.setFileStats(state, asset.name, { progress: 1 });
        if (this.allFilesUploaded(fileStats) && !uploadComplete) {
          if (userExperience().isVideographer) {
            Meteor.reconnect();
          }
          records.forEach(r => r.save());
          PubSub.publish(USER_IS_UPLOADING, false);
          if (!uploadComplete) { // if state has not already been set to complete
            PubSub.publish(UPLOAD_SUCCESSFUL, fileStats.toJS());
          }
          uploadComplete = true;
        }
        return {
          records, nameToId, fileStats, uploadComplete,
        };
      });
    };

    allFilesUploaded = progress => _.reduce(progress.toJS(), (res, val) => res && val.progress === 1, true)

    notifyFileAdded = (fileObj) => {
      const { onChange } = this.props;
      if (!onChange) {
        return;
      }
      const { record, fieldname } = this.props;
      const acceptsMultiple = getAcceptsMultipleFiles(record, fieldname);
      if (acceptsMultiple) {
        const newFieldValue = getFileIds(record, fieldname);
        newFieldValue.push(fileObj._id);
        this.onValueChange(newFieldValue);
      } else {
        this.onValueChange(fileObj._id);
      }
    };

    notifyFileRemoved = (fileId) => {
      const { record, fieldname } = this.props;
      const fileIds = getFileIds(record, fieldname);
      const newFieldValue = fileIds.filter(id => id !== fileId);
      this.onValueChange(newFieldValue);
    };

    fetchDocuments = (args) => {
      const { fieldname, record } = args;
      getFileDocuments(record, fieldname)
        .then((docs) => {
          docs.filter(d => d != null);
          this.setState({ docs });
        });
    };

    render() {
      const { docs, fileStats, uploadComplete } = this.state;
      return (
        <WrappedComponent
          onFileAdded={this.onFileAdded}
          onFileRemoved={this.onFileRemoved}
          files={docs}
          fileStats={fileStats}
          uploadComplete={uploadComplete}
          {...this.props}
        />
      );
    }
  }

  WithFileManager.propTypes = {
    fieldname: PropTypes.string.isRequired,
    record: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    saveEvent: PropTypes.string.isRequired,
  };
  return WithFileManager;
}

function getFileDocuments(record, fieldname) {
  const ids = getFileIds(record, fieldname);
  let file = null;
  const promises = ids.map(id => new Promise((resolve, reject) => {
    getSignedUrl.call({
      fileId: id,
      version: record.fileVersion,
    }, (err, url) => {
      if (err) {
        reject(err);
      } else {
        file = Models.Asset.fromId(id);
        if (file) {
          file.url = url;
        }
        resolve(file);
      }
    });
  }));

  return Promise.all(promises);
}

// function removeFileWithId(id, store) {
//   Assets.remove(id, (err) => {
//     if (err) {
//       alert(err);
//     }
//   });
// }

function getAcceptsMultipleFiles(record, fieldname) {
  const fieldtype = getFieldCustomType(record, fieldname);
  return fieldtype === 'fileArray';
}

function getFileBucket(record, fieldname) {
  const schemaBucket = record.schema.getFieldSchema(fieldname).bucket;
  return (schemaBucket) || Meteor.settings.public.s3.assets_bucket;
}

function getFieldCustomType(record, fieldname) {
  return record.schema.getFieldSchema(fieldname).customType;
}

function getFileIds(record, fieldname) {
  const fieldvalue = record[fieldname];
  if (fieldvalue instanceof List) {
    return fieldvalue.toArray();
  } if (!fieldvalue) {
    return [];
  } if (fieldvalue instanceof Array) {
    return fieldvalue;
  } if (typeof fieldvalue === 'string') {
    return [record[fieldname]];
  }
  throw new Meteor.Error('invalid-params', 'FileManager requires array, list, or string field');
}
