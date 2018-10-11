jest.mock('meteor/meteor');
jest.mock('meteor/mongo');
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';

global.Meteor = Meteor;
global.Mongo = Mongo;

configure({ adapter: new Adapter() });
