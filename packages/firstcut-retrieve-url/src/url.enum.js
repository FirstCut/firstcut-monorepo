import { Meteor } from 'firstcut-meteor';

export const S3_URL = "https://" + Meteor.settings.public.s3bucket + ".s3-us-west-2.amazonaws.com/";
export const SCREENSHOT_DIR = 'screenshots/';
export const HEADSHOT_DIR = 'headshots/';
