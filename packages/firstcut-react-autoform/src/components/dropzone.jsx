
import React from 'react';
import PropTypes from 'prop-types';
import { formatBytes } from 'firstcut-utils';
import {
  Progress, Image, Header, Card,
} from 'semantic-ui-react';
import { List, Map } from 'immutable';
import { detect } from 'detect-browser';
import Dropzone from 'react-dropzone';

const browser = detect();

function ProgressBar(props) {
  return <Progress percent={props.percent} indicating />;
}

class Drop extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    const { withFileManager } = this.props;
    const Enabled = withFileManager(PrivateDropzoneComponent);
    return <Enabled {...this.props} />;
  }
}

class PrivateDropzoneComponent extends React.Component {
  static defaultProps = {
    label: '',
  }

  state = { files: new List() }

  onDrop = (files) => {
    files.forEach(f => this.handleFile(f));
  }

  getDataTransferItems = (event) => {
    let dataTransferItemsList = [];
    if (event.dataTransfer) {
      const dt = event.dataTransfer;

      if (dt.files && dt.files.length) {
        dataTransferItemsList = dt.files;
      }
      if (dt.items && dt.items.length) {
        // During the drag even the dataTransfer.files is null
        // but Chrome implements some drag store, which is accesible via dataTransfer.items
        const { items } = dt;
        for (let i = 0; i < items.length; i++) {
          const entry = items[i].webkitGetAsEntry();
          if (entry) {
            traverseFileTree(entry, '', this.handleFile);
          }
        }
        dataTransferItemsList = dt.items;
      }
    } else if (event.target && event.target.files) {
      dataTransferItemsList = event.target.files;
    }

    // Convert from DataTransferItemsList to the native Array
    return Array.prototype.slice.call(dataTransferItemsList);
  }

  handleFile = (f, path = '') => {
    f.preview = window.URL.createObjectURL(f);
    let { files } = this.state;
    const { onFileAdded } = this.props;

    files = files.push(f);
    this.setState({ files });
    onFileAdded(f, path);
  }

  render() {
    const {
      fileStats, label, uploadComplete,
    } = this.props;
    const { files } = this.state;

    // const drop_props = removeNonDomFields(field_options);
    const dropzoneStyles = {
      'text-align': 'center',
      width: '100%',
      margin: 'auto',
      padding: '10px',
      border: '4px dashed red',
      'border-radius': '10px',
    };
    if (uploadComplete) {
      dropzoneStyles.border = '4px dashed green';
    }
    return (
      <Dropzone
        onDrop={this.onDrop}
        getDataTransferItems={this.getDataTransferItems}
        activeClassName="dragover"
        style={dropzoneStyles}
      >
        <Header>
          {' '}
          {label}
          {' '}
          { uploadComplete
            && (
            <span>
            UPLOAD COMPLETE!
            </span>
            )
          }
        </Header>

        <Card.Group>
          {
          files.map((f) => {
            let { progress, secondsLeft, readableSpeed } = fileStats.get(f.name) || {};
            if (progress <= 1) {
              progress *= 100;
            }
            return (
              <Card color={(progress === 100) ? 'green' : 'yellow'}>
                <Image src={f.preview} size="small" style={{ margin: 'auto' }} />
                <Card.Content>
                  <Card.Header>
                    {f.name}
                  </Card.Header>
                  <Card.Meta>
                    {formatBytes(f.size)}
                    { readableSpeed
                    && (
                    <b>
                      {' '}
                      Upload speed:
                      {' '}
                      {readableSpeed}
                    </b>
                    )
                    }
                  </Card.Meta>
                </Card.Content>
                <Card.Content>
                  <ProgressBar percent={progress} label="Uploading..." />
                  { secondsLeft
                    && (
                    <b>
                      {' '}
                      time remaining:
                      {' '}
                      {humanReadableSeconds(secondsLeft)}
                    </b>
                    )}
                </Card.Content>
              </Card>
            );
          })
        }
        </Card.Group>
      </Dropzone>
    );
  }
}

function traverseFileTree(item, p, cb) {
  const path = p || '';
  if (item.isFile) {
    // Get file
    item.file((file) => {
      cb(file, path);
    });
  } else if (item.isDirectory) {
    // Get folder contents
    const dirReader = item.createReader();
    dirReader.readEntries((entries) => {
      for (let i = 0; i < entries.length; i++) {
        traverseFileTree(entries[i], `${path + item.name}/`, cb);
      }
    });
  }
}

// shamelessly copied from stackoverflow https://stackoverflow.com/questions/8211744/convert-time-interval-given-in-seconds-into-more-human-readable-form
function humanReadableSeconds(seconds) {
  if (!seconds) {
    return 0;
  }
  const numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  const numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  const numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
  return `${numhours} hours ${numminutes} minutes ${numseconds} seconds`;
}

PrivateDropzoneComponent.propTypes = {
  onFileAdded: PropTypes.func.isRequired,
  onFileRemoved: PropTypes.func.isRequired,
  progress: PropTypes.instanceOf(Map).isRequired,
  label: PropTypes.string,
};

export default Drop;
