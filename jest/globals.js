jest.mock('meteor/meteor');
jest.mock('meteor/mongo');
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

global.Meteor = Meteor;
global.Mongo = Mongo;
