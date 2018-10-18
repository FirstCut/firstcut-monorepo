
import Models from '/imports/api/models';
import { _ } from 'lodash';
import StubCollections from 'meteor/hwillson:stub-collections';
import crypto from 'crypto';
import oid from 'mdbid';

const {
  Cut, Deliverable, Project, Collaborator, Client, Shoot,
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
      { event: 'shoot_wrap', timestamp: '2001-05-02T08:00:00.000Z' },
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

describe('base model', () => {
  after(() => {
    StubCollections.restore();
  });

  before(() => {
    const collections = Models.allModels.map(m => m.collection);
    StubCollections.add(collections);
    StubCollections.stub();
    projectSamples.forEach(p => Project.createNew(p).save());
  });
  describe('mongo interface', () => {
    it('should return all records with empty query', () => {
      const query = {};
      const projects = Project.find(query);
      expect(projects.size).to.equal(projectSamples.length);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).blueprint).to.be.a('string');
    });

    it('should filter by simple fields', () => {
      let blueprint = 'CUSTOMER_TESTIMONIAL';
      let query = { blueprint };
      let projects = Project.find(query);
      expect(projects.size).to.equal(1);
      expect(projects.get(0).blueprint).to.equal(blueprint);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).blueprint).to.be.a('string');

      blueprint = 'NOT_A_TEMPLATE';
      projects = Project.find({ blueprint });
      query = { blueprint };
      expect(projects.size).to.equal(1);
      expect(projects.get(0).blueprint).to.equal(blueprint);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).blueprint).to.be.a('string');
    });

    it('should handle nested mongo fields');
    it('should handle filtering by a non-empty array field');

    it('should handle mongo regex query', () => {
      const query = { name: { $regex: /Testimonial/ } };
      const projects = Project.find(query);
      expect(projects.size).to.equal(1);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).name).to.equal(projectSamples[0].name);
    });

    it('should handle undefined query fields', () => {
      const query = {
        blueprint: undefined,
        assets: [],
        name: '',
      };

      const projects = Project.find(query);
      expect(projects.size).to.equal(3);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).blueprint).to.be.a('string');
    });

    it('should handle mongo selector fields', () => {
      let blueprints = ['CUSTOMER_TESTIMONIAL'];
      let query = { blueprint: { $in: blueprints } };
      let projects = Project.find(query);
      expect(projects.size).to.equal(1);
      expect(projects.get(0).blueprint).to.equal(blueprints[0]);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).blueprint).to.be.a('string');

      blueprints = ['CUSTOMER_TESTIMONIAL', 'NOT_A_TEMPLATE'];
      query = { blueprint: { $in: blueprints } };
      projects = Project.find(query);
      expect(projects.size).to.equal(2);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).blueprint).to.be.a('string');
    });


    it('should filter by record fields using mongo queries', () => {
      let query = {
        isDummy: true,
      };
      let result = Project.find(query);
      expect(result.size).to.equal(2);

      query = {
        isDummy: { $ne: true },
      };
      result = Project.find(query);
      expect(result.size).to.equal(1);
    });


    it('should know who created the record', () => {
      const project = Project.createNew(projectSamples[0]);
      expect(project.createdBy).to.equal(sampleInitiatorId);
    });
  });
});
