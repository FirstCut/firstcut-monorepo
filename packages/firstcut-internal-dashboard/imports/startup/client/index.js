import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {initUploader} from 'firstcut-uploader';

import AppContainer from '/imports/ui/containers/app.container.jsx';

import '/imports/startup/both';
import 'firstcut-models';

global.Buffer = function() {}
global.Buffer.isBuffer = () => false

Meteor.startup(() => {
  initUploader({
    aws_key: Meteor.settings.public.s3.key,
    bucket: Meteor.settings.public.s3.assets_bucket,
    awsRegion: Meteor.settings.public.s3.region,
  });
  render(<AppContainer />, document.getElementById('react-root'));
});
