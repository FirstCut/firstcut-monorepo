import { Meteor } from 'firstcut-meteor';
import { initUploader } from 'firstcut-uploader';
import Asset from './asset';

Meteor.startup(() => {
  if (Meteor.isClient) {
    initUploader();
  }
});
export default Asset;
