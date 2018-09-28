"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _lodash = require("lodash");

var Cut = _firstcutModels.default.Cut,
    Deliverable = _firstcutModels.default.Deliverable,
    Project = _firstcutModels.default.Project,
    Collaborator = _firstcutModels.default.Collaborator,
    Client = _firstcutModels.default.Client,
    Shoot = _firstcutModels.default.Shoot;
var sampleInitiatorId = '1111';
var projectSamples = [{
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
  history: [{
    event: 'shoot_wrap',
    timestamp: '2001-05-01T08:00:00.000Z'
  }, {
    event: 'record_created',
    timestamp: '2001-05-01T08:00:00.000Z',
    initiator_player_id: sampleInitiatorId
  }]
}, {
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
  history: [{
    event: 'shoot_checkin',
    timestamp: '2001-07-01T08:00:00.000Z'
  }, {
    event: 'shoot_wrap',
    timestamp: '2001-05-01T08:00:00.000Z'
  }]
}, {
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
  history: [{
    event: 'project_wrap',
    timestamp: '2001-05-01T08:00:00.000Z'
  }, {
    event: 'record_created',
    timestamp: '2001-05-01T08:00:00.000Z',
    initiator_player_id: sampleInitiatorId
  }]
}];
describe('base model', function () {
  before(function () {
    projectSamples.forEach(function (p) {
      return Project.createNew(p).save();
    });
  });
  describe('mongo interface', function () {
    it('should return all records with empty query', function () {
      var query = {};
      var projects = Project.find(query);
      expect(projects.size).to.equal(projectSamples.length);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).blueprint).to.be.a('string');
    });
    it('should filter by simple fields', function () {
      var blueprint = 'CUSTOMER_TESTIMONIAL';
      var query = {
        blueprint: blueprint
      };
      var projects = Project.find(query);
      expect(projects.size).to.equal(1);
      expect(projects.get(0).blueprint).to.equal(blueprint);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).blueprint).to.be.a('string');
      blueprint = 'NOT_A_TEMPLATE';
      projects = Project.find({
        blueprint: blueprint
      });
      query = {
        blueprint: blueprint
      };
      expect(projects.size).to.equal(1);
      expect(projects.get(0).blueprint).to.equal(blueprint);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).blueprint).to.be.a('string');
    });
    it('should handle nested mongo fields');
    it('should handle filtering by a non-empty array field');
    it('should handle mongo regex query', function () {
      var query = {
        name: {
          $regex: /Testimonial/
        }
      };
      var projects = Project.find(query);
      expect(projects.size).to.equal(1);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).name).to.equal(projectSamples[0].name);
    });
    it('should handle undefined query fields', function () {
      var query = {
        blueprint: undefined,
        assets: [],
        name: ''
      };
      var projects = Project.find(query);
      expect(projects.size).to.equal(3);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).blueprint).to.be.a('string');
    });
    it('should handle mongo selector fields', function () {
      var blueprints = ['CUSTOMER_TESTIMONIAL'];
      var query = {
        blueprint: {
          $in: blueprints
        }
      };
      var projects = Project.find(query);
      expect(projects.size).to.equal(1);
      expect(projects.get(0).blueprint).to.equal(blueprints[0]);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).blueprint).to.be.a('string');
      blueprints = ['CUSTOMER_TESTIMONIAL', 'NOT_A_TEMPLATE'];
      query = {
        blueprint: {
          $in: blueprints
        }
      };
      projects = Project.find(query);
      expect(projects.size).to.equal(2);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).blueprint).to.be.a('string');
    });
    it('should filter by calculated fields', function () {
      var latestKeyEvent = 'SHOOT_COMPLETED';
      var query = {
        latestKeyEvent: latestKeyEvent
      };
      console.log(query);
      var projects = Project.find(query);
      console.log(projects);
      expect(projects.size).to.equal(1);
      console.log(projects.get(0).latestKeyEvent);
      expect(projects.get(0).latestKeyEvent).to.equal(latestKeyEvent);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).blueprint).to.be.a('string');
      latestKeyEvent = 'SHOOT_IN_PROGRESS';
      query = {
        latestKeyEvent: latestKeyEvent
      };
      projects = Project.find(query);
      expect(projects.size).to.equal(1);
      expect(projects.get(0).latestKeyEvent).to.equal(latestKeyEvent);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).blueprint).to.be.a('string');
    });
    it('should filter by calculated fields where value is function', function () {
      var _latestKeyEvent = 'SHOOT_COMPLETED';
      var query = {
        latestKeyEvent: function latestKeyEvent(e) {
          return e === _latestKeyEvent;
        }
      };
      var projects = Project.find(query);
      expect(projects.size).to.equal(1);
      expect(projects.get(0).latestKeyEvent).to.equal(_latestKeyEvent);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).blueprint).to.be.a('string');
      _latestKeyEvent = 'PROJECT_WRAPPED';
      query = {
        latestKeyEvent: function latestKeyEvent(e) {
          return e !== _latestKeyEvent;
        }
      };
      projects = Project.find(query);
      expect(projects.size).to.equal(2);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).blueprint).to.be.a('string');
    });
    it('should filter by calculated fields when key is function on model', function () {
      var query = {
        isWrapped: true
      };
      var projects = Project.find(query);
      expect(projects.size).to.equal(1);
      expect(Project.count(query)).to.equal(projects.size);
      query = {
        isWrapped: false
      };
      projects = Project.find(query);
      expect(projects.size).to.equal(2);
      expect(Project.count(query)).to.equal(projects.size);
      expect(Project.findOne(query).blueprint).to.be.a('string');
    });
    it('should know who created the record', function () {
      var project = Project.createNew(projectSamples[0]);
      expect(project.createdBy).to.equal(sampleInitiatorId);
    });
  });
});