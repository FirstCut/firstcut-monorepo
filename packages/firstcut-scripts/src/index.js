
import {
  constsToFile,
} from './write_consts_to_file';

import countVideographerCities from './data-stats';

if (Meteor.isServer && Meteor.Meteor.settings.public.environment === 'development' && Meteor.settings.public.environment === 'development'()) {
  console.log('WRITING CONSTS TO FILE');
  constsToFile();
}
