
import React from 'react';
import {
  Card, Container, Image, Embed,
} from 'semantic-ui-react';
import { HumanReadableDate } from '/imports/ui/components/utils/dates';
import { _ } from 'lodash';
import Buttons from './buttons';
import ConfirmationModal from './confirmation.modal';
import { withFileManager, withRecordManager } from '/imports/ui/components/managers';

export function FilePortal(props) {
  const { record, view, ...rest } = props;
  const WithFileManagement = _.flowRight(withRecordManager, withFileManager)(view);
  const saveEvent = `save.${record._id}.files`;
  return (
    <Container>
      <WithFileManagement seedRecord={record} {...rest} saveEvent={saveEvent} />
    </Container>
  );
}

export function FileView(props) {
  const { files, onFileRemoved } = props;
  return (
    <Card.Group>
      {
        files.map((f, i) => {
          if (f) {
            const reactKey = `file-${i}`;
            return (
              <FileCard
                key={reactKey}
                file={f}
                onFileRemoved={onFileRemoved}
              />
            );
          }
        })
      }
    </Card.Group>
  );
}

class FileCard extends React.Component {
  state = { modalOpen: false }

  openConfirmationModal = () => {
    this.setState({ modalOpen: true });
  }

  closeConfirmationModal = () => {
    this.setState({ modalOpen: false });
  }

  deleteFile = () => {
    this.props.onFileRemoved(this.props.file);
    this.closeConfirmationModal();
  }

  render() {
    const { file, deleteFile, downloadFile } = this.props;
    const modalProps = {
      open: this.state.modalOpen,
      title_icon: 'trash',
      title: 'Delete file?',
      onDeny: this.closeConfirmationModal,
      onConfirm: this.deleteFile,
      content: `Are you sure you would like to delete ${file.name}?`,
    };
    const View = (file.isVideo) ? Video : Image;
    const sizeInMB = file.size / 1000000;
    return (
      <Card size="small" color="black">
        <View src={file.url} />
        <Card.Content>
          <Card.Description>
            {file.name}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className="ui two buttons">
            <Buttons.Download href={file.url} download={file.name} />
            <Buttons.Delete onClick={this.openConfirmationModal} />
          </div>
        </Card.Content>
        <Card.Meta>
          size:
          {' '}
          {sizeInMB}
          MB,
          uploaded:
          <HumanReadableDate format="short" date={file.createdAt} />
        </Card.Meta>
        <ConfirmationModal {...modalProps} />
      </Card>
    );
  }
}

export function VideoFrame(props) {
  const { files } = props;
  if (!files || files.length === 0 || files[0] == null) {
    return <Container />;
  }
  const src = files[0].url;
  return (
    <Container>
      <Video src={src} />
    </Container>
  );
}

export function Video(props) {
  const { src } = props;
  return (
    <Embed
      url={src}
    />
  );
}
