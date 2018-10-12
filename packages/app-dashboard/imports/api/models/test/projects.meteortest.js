
import Models from '/imports/api/models';
import { _ } from 'lodash';
import StubCollections from 'meteor/hwillson:stub-collections';
import oid from 'mdbid';

const {
  Project,
} = Models;

const sampleInitiatorId = '1111';
const projectSamples = [
  {
    _id: oid(),
    blueprint: 'CUSTOMER_TESTIMONIAL',
    isDummy: true,
    name: 'Dodo Testimonial',
    clientOwnerId: 'nXeHiqdrn4a6nNjM4',
    adminOwnerId: 'p3eGR6CjEbzPS3uZr',
    companyId: 'ky5zKCPwZCjubw3k9',
    assets: [],
    createdBy: 'wRdqkjp5HXuWzihzN',
    createdAt: '2018-05-07T23:39:33.282Z',
    updatedAt: '2018-05-07T23:39:33.284Z',
    history: [
      { event: 'shoot_wrap', timestamp: '2001-05-01T08:00:00.000Z' },
      { event: 'record_created', timestamp: '2001-05-01T08:00:00.000Z', initiator_player_id: sampleInitiatorId },
    ],
  },
  {
    _id: oid(),
    blueprint: 'NOT_A_TEMPLATE',
    isDummy: true,
    name: 'Dodo Not a template',
    clientOwnerId: 'nXeHiqdrn4a6nNjM4',
    adminOwnerId: 'p3eGR6CjEbzPS3uZr',
    companyId: 'ky5zKCPwZCjubw3k9',
    assets: ['something'],
    createdBy: 'wRdqkjp5HXuWzihzN',
    createdAt: '2018-05-07T23:39:33.282Z',
    updatedAt: '2018-05-07T23:39:33.284Z',
    history: [
      { event: 'shoot_checkin', timestamp: '2001-07-01T08:00:00.000Z' },
      { event: 'shoot_wrap', timestamp: '2001-05-01T08:00:00.000Z' },
    ],
  },
  {
    _id: oid(),
    blueprint: 'PROJECTWRAPPED',
    isDummy: true,
    name: 'Project Wrapped',
    clientOwnerId: 'nXeHiqdrn4a6nNjM4',
    adminOwnerId: 'p3eGR6CjEbzPS3uZr',
    companyId: 'ky5zKCPwZCjubw3k9',
    assets: [],
    createdBy: 'wRdqkjp5HXuWzihzN',
    createdAt: '2018-05-07T23:39:33.282Z',
    updatedAt: '2018-05-07T23:39:33.284Z',
    history: [
      { event: 'project_wrap', timestamp: '2001-05-01T08:00:00.000Z' },
      { event: 'record_created', timestamp: '2001-05-01T08:00:00.000Z', initiator_player_id: sampleInitiatorId },
    ],
  },
];


describe('projects', () => {
  after(() => {
    StubCollections.restore();
  });

  before(() => {
    const collections = Models.allModels.map(m => m.collection);
    StubCollections.add(collections);
    StubCollections.stub();
    projectSamples.forEach(p => Project.createNew(p).save());
  });

  it('should know its latest key event', () => {
    expect(Project.createNew(projectSamples[0]).getLatestKeyEvent()).to.equal('SHOOT_COMPLETED');
    expect(Project.createNew(projectSamples[1]).getLatestKeyEvent()).to.equal('SHOOT_IN_PROGRESS');
    expect(Project.createNew(projectSamples[2]).getLatestKeyEvent()).to.equal('PROJECT_WRAPPED');
  });
});
