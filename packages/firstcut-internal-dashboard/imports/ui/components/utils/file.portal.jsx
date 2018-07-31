
import React from 'react';
import { Card, Container, Image, Embed } from 'semantic-ui-react'
import { isEmpty } from 'firstcut-utils';
import { HumanReadableDate } from '/imports/ui/components/utils/dates.jsx';
import Buttons from './buttons.jsx';
import ConfirmationModal from './confirmation.modal.jsx';
import {withFileManager, withRecordManager} from 'firstcut-hoc';
import { _ } from 'lodash';

export function FilePortal(props) {
  const { view } = props;
  const WithFileManagement = _.flowRight(withRecordManager, withFileManager)(view);
  const save_event = `save.${props.record._id}`;
  const { record, ...rest } = props;
  return (
    <Container>
      <WithFileManagement seed_record={props.record} {...rest} save_event={save_event}/>
    </Container>
  )
}

export function FileView(props) {
  const {files, onFileRemoved} = props;
  return (
    <Card.Group>
      {
        files.map((f, i)=> {
          const react_key = `file-${i}`;
          return (
            <FileCard
              key={react_key}
              file={f}
              onFileRemoved={onFileRemoved}
              />
            )
        })
      }
    </Card.Group>
  )
}

class FileCard extends React.Component {
  state = {modal_open: false}

  openConfirmationModal = ()=> {
    this.setState({modal_open:true});
  }

  closeConfirmationModal = ()=> {
    this.setState({modal_open:false});
  }

  deleteFile = ()=> {
    this.props.onFileRemoved(this.props.file);
    this.closeConfirmationModal();
  }

  render() {
    const {file, deleteFile, downloadFile} = this.props;
    const modal_props = {
      open: this.state.modal_open,
      title_icon: 'trash',
      title: `Delete file?`,
      onDeny: this.closeConfirmationModal,
      onConfirm: this.deleteFile,
      content: `Are you sure you would like to delete ${file.name}?`,
    }
    const View = (file.isVideo) ? Video : Image;
    const mb_size = file.size / 1000000;
    return (
      <Card size='small' color='black'>
        <View src={file.url} />
        <Card.Content>
          <Card.Description>
            {file.name}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className='ui two buttons'>
            <Buttons.Download href={file.url} download={file.name}/>
            <Buttons.Delete onClick={this.openConfirmationModal}/>
          </div>
        </Card.Content>
        <Card.Meta>
          size: {mb_size}MB,
          uploaded:
          <HumanReadableDate format='short' date={file.createdAt} />
        </Card.Meta>
        <ConfirmationModal {...modal_props}/>
      </Card>
    )
  }
}

export function VideoFrame(props) {
  const {files} = props;
  if (!files || files.length == 0) {
    return <Container></Container>;
  }
  const src = files[0].url;
  return (
    <Container>
      <Video src={src} />
    </Container>
  )
}

export function Video(props) {
  const {src} = props;
  return (
    <Embed
      url={src}
      />
    )
}
