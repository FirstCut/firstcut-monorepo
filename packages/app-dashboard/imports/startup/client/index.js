import '/imports/startup/both';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { initUploader } from 'firstcut-uploader';
import Models from '/imports/api/models';

import AppContainer from '/imports/ui/containers/app.container';
import Analytics from 'firstcut-analytics';

Meteor.startup(() => {
  const uploader = initUploader({
    PLATFORM_ROOT_URL: Meteor.settings.public.PLATFORM_ROOT_URL,
    key: Meteor.settings.public.s3.key,
    region: Meteor.settings.public.s3.region,
    assets_bucket: Meteor.settings.public.s3.assets_bucket,
    environment: Meteor.settings.public.environment,
  });
  Models.Asset.setUploader(uploader);
  render(<AppContainer />, document.getElementById('react-root'));
  Analytics.init(Models, {
    development: Meteor.settings.public.environment === 'development',
  });
  // }
});
