
import React from 'react';
import { Container } from 'semantic-ui-react';
import { PubSub } from 'pubsub-js';
import ShootClientInfoPage from './shoot.client';
import { USER_IS_UPLOADING, UPLOAD_SUCCESSFUL } from '/imports/ui/config';
import { emitPipelineEvent } from 'firstcut-utils';
import { withRecordManager } from '/imports/ui/components/managers';
import { Autoform } from 'firstcut-react-autoform';
import { userPlayer } from 'firstcut-players';

export default class ShootVideographerInfoPage extends React.Component {
  // state = { hasEmittedUploadingEvent: false }

  componentDidMount() {
    PubSub.subscribe(UPLOAD_SUCCESSFUL, (e, fileStats) => {
      const { record } = this.props;
      emitPipelineEvent({
        event: 'footage_batch_uploaded', record, fileStats,
      });
    });
  }

  componentWillUnmount() {
    PubSub.unsubscribe(USER_IS_UPLOADING);
    PubSub.unsubscribe(UPLOAD_SUCCESSFUL);
  }

  shouldComponentUpdate() {
    return false; // don't update in case of updates to record, to prevent wiping of files while uploading
  }

  render() {
    const { record } = this.props;
    return (
      <Container>
        <ShootClientInfoPage {...this.props} />
        {' '}
        <FootageUploadDropzone record={record} />
        {' '}
      </Container>
    );
  }
}

function FootageUploadDropzone(props) {
  const { record } = props;
  const saveEvent = `save.${record.displayName}`;
  const UploadForm = withRecordManager(Autoform);
  const fields = ['footageFiles'];
  return (
    <UploadForm
      fields={fields}
      saveEvent={saveEvent}
      seedRecord={record}
      onSaveSuccess={() => {}}
    />
  );
}
