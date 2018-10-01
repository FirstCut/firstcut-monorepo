"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _firstcutTestingUtils = require("firstcut-testing-utils");

var _project = require("./project");

var _immutable = require("immutable");

var _lodash = require("lodash");

var Cut = _firstcutModels.default.Cut,
    Deliverable = _firstcutModels.default.Deliverable,
    Project = _firstcutModels.default.Project,
    Collaborator = _firstcutModels.default.Collaborator,
    Client = _firstcutModels.default.Client,
    Shoot = _firstcutModels.default.Shoot;
var EXAMPLE_HISTORIES = new _immutable.List([{
  stage: 'BOOKING',
  histories: [[], [{
    event: 'feedback_sent_reminder',
    timestamp: '2001-07-01T08:00:00.000Z'
  }, {
    event: 'cut_due_reminder',
    timestamp: '2001-07-01T08:00:00.000Z'
  }]]
}, {
  stage: 'SHOOT_READY',
  histories: [[{
    event: 'footage_verified',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'send_cut_to_client',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'preproduction_kickoff',
    timestamp: '2001-07-01T08:00:00.000Z'
  }, {
    event: 'shoot_wrap',
    timestamp: '2001-05-01T08:00:00.000Z'
  }, {
    event: 'shoot_checkout',
    timestamp: '2001-05-01T08:00:00.000Z'
  }, {
    event: 'cut_approved_by_client',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'shoot_wrap',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'revisions_sent',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'preproduction_kickoff',
    timestamp: '2001-01-02T08:00:00.000Z'
  }], [{
    event: 'preproduction_kickoff',
    timestamp: '2001-07-01T08:00:00.000Z'
  }]]
}, {
  stage: 'SHOOT_COMPLETED',
  histories: [[{
    event: 'footage_verified',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'send_cut_to_client',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'shoot_wrap',
    timestamp: '2001-07-01T08:00:00.000Z'
  }, {
    event: 'preproduction_kickoff',
    timestamp: '2001-05-01T08:00:00.000Z'
  }, {
    event: 'shoot_checkout',
    timestamp: '2001-05-01T08:00:00.000Z'
  }, {
    event: 'cut_approved_by_client',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'shoot_wrap',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'revisions_sent',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'preproduction_kickoff',
    timestamp: '2001-01-02T08:00:00.000Z'
  }], [{
    event: 'shoot_wrap',
    timestamp: '2001-07-01T08:00:00.000Z'
  }]]
}, {
  stage: 'SHOOT_IN_PROGRESS',
  histories: [[{
    event: 'footage_verified',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'send_cut_to_client',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'shoot_checkin',
    timestamp: '2001-07-01T08:00:00.000Z'
  }, {
    event: 'shoot_wrap',
    timestamp: '2001-05-01T08:00:00.000Z'
  }, {
    event: 'shoot_checkout',
    timestamp: '2001-05-01T08:00:00.000Z'
  }, {
    event: 'cut_approved_by_client',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'shoot_wrap',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'revisions_sent',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'preproduction_kickoff',
    timestamp: '2001-01-02T08:00:00.000Z'
  }], [{
    event: 'shoot_checkin',
    timestamp: '2001-07-01T08:00:00.000Z'
  }]]
}, {
  stage: 'FOOTAGE_UPLOADED',
  histories: [[{
    event: 'footage_verified',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'send_cut_to_client',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'confirm_footage_uploaded',
    timestamp: '2001-07-01T08:00:00.000Z'
  }, {
    event: 'cut_approved_by_client',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'shoot_wrap',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'revisions_sent',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'preproduction_kickoff',
    timestamp: '2001-01-02T08:00:00.000Z'
  }], [{
    event: 'confirm_footage_uploaded',
    timestamp: '2001-07-01T08:00:00.000Z'
  }]]
}, {
  stage: 'FOOTAGE_VERIFIED',
  histories: [[{
    event: 'footage_verified',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'send_cut_to_client',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'footage_verified',
    timestamp: '2001-07-01T08:00:00.000Z'
  }, {
    event: 'cut_approved_by_client',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'shoot_wrap',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'revisions_sent',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'preproduction_kickoff',
    timestamp: '2001-01-02T08:00:00.000Z'
  }], [{
    event: 'footage_verified',
    timestamp: '2001-07-01T08:00:00.000Z'
  }]]
}, {
  stage: 'EDITOR_WORKING_ON_CUT',
  histories: [[{
    event: 'footage_verified',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'send_cut_to_client',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'revisions_sent',
    timestamp: '2001-07-01T08:00:00.000Z'
  }, {
    event: 'cut_approved_by_client',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'shoot_wrap',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'revisions_sent',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'preproduction_kickoff',
    timestamp: '2001-01-02T08:00:00.000Z'
  }], [{
    event: 'revisions_sent',
    timestamp: '2001-07-01T08:00:00.000Z'
  }]]
}, {
  stage: 'CUT_UPLOADED',
  histories: [[{
    event: 'footage_verified',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'send_cut_to_client',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-07-01T08:00:00.000Z'
  }, {
    event: 'cut_approved_by_client',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'shoot_wrap',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'revisions_sent',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'preproduction_kickoff',
    timestamp: '2001-01-02T08:00:00.000Z'
  }], [{
    event: 'cut_uploaded',
    timestamp: '2001-07-01T08:00:00.000Z'
  }]]
}, {
  stage: 'CUT_SENT_TO_CLIENT',
  histories: [[{
    event: 'footage_verified',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'send_cut_to_client',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'send_cut_to_client',
    timestamp: '2001-07-01T08:00:00.000Z'
  }, {
    event: 'cut_approved_by_client',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'shoot_wrap',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'revisions_sent',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'preproduction_kickoff',
    timestamp: '2001-01-02T08:00:00.000Z'
  }], [{
    event: 'send_cut_to_client',
    timestamp: '2001-07-01T08:00:00.000Z'
  }]]
}, {
  stage: 'CLIENT_RESPONDED_TO_CUT',
  histories: [[{
    event: 'footage_verified',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'send_cut_to_client',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'feedback_submitted_by_client',
    timestamp: '2001-07-01T08:00:00.000Z'
  }, {
    event: 'cut_approved_by_client',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'shoot_wrap',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'revisions_sent',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'preproduction_kickoff',
    timestamp: '2001-01-02T08:00:00.000Z'
  }], [{
    event: 'feedback_submitted_by_client',
    timestamp: '2001-07-01T08:00:00.000Z'
  }]]
}, {
  stage: 'CLIENT_APPROVED_CUT',
  histories: [[{
    event: 'footage_verified',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'send_cut_to_client',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'cut_approved_by_client',
    timestamp: '2001-07-01T08:00:00.000Z'
  }, {
    event: 'cut_approved_by_client',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'shoot_wrap',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: '',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'preproduction_kickoff',
    timestamp: '2001-01-02T08:00:00.000Z'
  }], [{
    event: 'cut_approved_by_client',
    timestamp: '2001-07-01T08:00:00.000Z'
  }]]
}, {
  stage: 'PROJECT_WRAPPED',
  histories: [[{
    event: 'shoot_wrap',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'preproduction_kickoff',
    timestamp: '2001-01-02T08:00:00.000Z'
  }, {
    event: 'project_wrap',
    timestamp: '2001-04-01T08:00:00.000Z'
  }], [{
    event: 'project_wrap',
    timestamp: '2001-04-01T08:00:00.000Z'
  }], [{
    event: 'project_wrap',
    timestamp: '2001-01-01T08:00:00.000Z'
  }, {
    event: 'shoot_wrap',
    timestamp: '2001-02-01T08:00:00.000Z'
  }, {
    event: 'cut_uploaded',
    timestamp: '2001-03-01T08:00:00.000Z'
  }, {
    event: 'preproduction_kickoff',
    timestamp: '2001-01-02T08:00:00.000Z'
  }]]
}]);
describe('project model', function () {
  before(function () {
    (0, _firstcutTestingUtils.insertTestData)();
  });
  describe('immutable factory', function () {
    it('should combine shoot, cut, and deliverable events into complete history', function () {
      var projectId = '11123222';
      var cutOneTemplate = _firstcutTestingUtils.sample_cuts[0];
      var cutTwoTemplate = _firstcutTestingUtils.sample_cuts[1];
      var deliverableTemplate = _firstcutTestingUtils.sample_deliverables[0];
      var shootTemplate = _firstcutTestingUtils.sample_shoots[0];
      var projectTemplate = _firstcutTestingUtils.sample_projects[0];
      var combinedHistories = [EXAMPLE_HISTORIES.get(0).histories[0], EXAMPLE_HISTORIES.get(1).histories[0], EXAMPLE_HISTORIES.get(1).histories[1], EXAMPLE_HISTORIES.get(2).histories[0], EXAMPLE_HISTORIES.get(2).histories[1]];
      projectTemplate._id = projectId;
      deliverableTemplate.projectId = projectTemplate._id;
      shootTemplate.projectId = projectTemplate._id;
      cutOneTemplate.deliverableId = deliverableTemplate._id;
      cutTwoTemplate.deliverableId = deliverableTemplate._id;
      [cutOneTemplate, cutTwoTemplate, deliverableTemplate, projectTemplate, shootTemplate].forEach(function (template, i) {
        template.history = combinedHistories[i];
      });
      Cut.createNew(cutOneTemplate).save();
      Cut.createNew(cutTwoTemplate).save();
      Shoot.createNew(shootTemplate).save();
      Deliverable.createNew(deliverableTemplate).save();
      var project = Project.createNew(projectTemplate);
      var completeHistory = project.completeRecordAndChildrenHistory.toArray();

      var flatCombined = _lodash._.flatten(combinedHistories);

      expect(flatCombined.length).to.equal(completeHistory.length);
      var historyEvents = completeHistory.map(function (e) {
        return e.event;
      }).sort();
      var flatCombinedEvents = flatCombined.map(function (e) {
        return e.event;
      }).sort();
      expect(flatCombinedEvents).to.deep.equal(historyEvents); // expect it to be sorted already by timestamp

      var unsorted = completeHistory.map(function (e) {
        return e.timestamp;
      });
      var sorted = unsorted.sort();
      expect(unsorted).to.deep.equal(sorted);
    });
    it('should return correct latest key event', function (done) {
      var project;
      var projectTemplate;
      EXAMPLE_HISTORIES.forEach(function (example) {
        example.histories.forEach(function (h) {
          _firstcutTestingUtils.sample_projects.forEach(function (p) {
            projectTemplate = p;
            projectTemplate.history = h;
            projectTemplate._id = 'fakeId';
            project = _firstcutModels.default.Project.createNew(projectTemplate);
            expect(example.stage).to.equal(project.latestKeyEvent);
            expect(project.latestKeyEventLabel).to.exist;
          });
        });
      });
      done();
    });
  });
  describe('schema', function () {
    it('should be able to set the blueprint', function () {
      var project = Project.createNew({});
      var blueprint = 'CUSTOMER_TESTIMONIAL';
      project = project.set('blueprint', blueprint);
      expect(project.blueprint).to.equal(blueprint);
    });
    it('should calculate stages correctly', function () {
      EXAMPLE_HISTORIES.forEach(function (example) {
        example.histories.forEach(function (h) {
          expect((0, _project.calculateStage)(h)).to.equal(example.stage);
        });
      });
    });
  });
});