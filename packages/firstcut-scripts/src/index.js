
import {
  constsToFile,
} from './write_consts_to_file';

import countVideographerCities from './data-stats';

if (Meteor.isServer && Meteor.isDevelopment && isDevelopment()) {
  console.log('WRITING CONSTS TO FILE');
  constsToFile();
}
