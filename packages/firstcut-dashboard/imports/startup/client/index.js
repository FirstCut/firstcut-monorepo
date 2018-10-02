import React from 'react';
import { Meteor } from 'firstcut-meteor';
import { render } from 'react-dom';

import AppContainer from '/imports/ui/containers/app.container';

import '/imports/startup/both';
import 'firstcut-models';
import Analytics from 'firstcut-analytics';


Meteor.startup(() => {
  // if (Meteor.settings.public.isPipelineDeployment) {
  //   render(
  //     (<span>
  //       This is the pipeline deployment
  //       {' '}
  //     </span>), document.getElementById('react-root'),
  //   );
  // } else {
  render(<AppContainer />, document.getElementById('react-root'));
  Analytics.init();
  // }
});
