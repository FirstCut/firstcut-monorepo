
import Models from 'firstcut-models';
import {
  sample_projects, sample_shoots, sample_deliverables, sample_cuts, insertTestData,
} from 'firstcut-testing-utils';
import { calculateStage } from './project';
import { List } from 'immutable';
import { _ } from 'lodash';

const {
  Cut, Deliverable, Project, Collaborator, Client, Shoot,
} = Models;

const EXAMPLE_HISTORIES = new List([
  {
    stage: 'BOOKING',
    histories: [
      [],
      [
        { event: 'feedback_sent_reminder', timestamp: '2001-07-01T08:00:00.000Z' },
        { event: 'cut_due_reminder', timestamp: '2001-07-01T08:00:00.000Z' },
      ],
    ],
  }, {
    stage: 'SHOOT_READY',
    histories: [
      [
        { event: 'footage_verified', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'send_cut_to_client', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'preproduction_kickoff', timestamp: '2001-07-01T08:00:00.000Z' },
        { event: 'shoot_wrap', timestamp: '2001-05-01T08:00:00.000Z' },
        { event: 'shoot_checkout', timestamp: '2001-05-01T08:00:00.000Z' },
        { event: 'cut_approved_by_client', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'shoot_wrap', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'revisions_sent', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'preproduction_kickoff', timestamp: '2001-01-02T08:00:00.000Z' },
      ],
      [
        { event: 'preproduction_kickoff', timestamp: '2001-07-01T08:00:00.000Z' },
      ],
    ],
  }, {
    stage: 'SHOOT_COMPLETED',
    histories: [
      [
        { event: 'footage_verified', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'send_cut_to_client', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'shoot_wrap', timestamp: '2001-07-01T08:00:00.000Z' },
        { event: 'preproduction_kickoff', timestamp: '2001-05-01T08:00:00.000Z' },
        { event: 'shoot_checkout', timestamp: '2001-05-01T08:00:00.000Z' },
        { event: 'cut_approved_by_client', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'shoot_wrap', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'revisions_sent', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'preproduction_kickoff', timestamp: '2001-01-02T08:00:00.000Z' },
      ],
      [
        { event: 'shoot_wrap', timestamp: '2001-07-01T08:00:00.000Z' },
      ],
    ],
  }, {
    stage: 'SHOOT_IN_PROGRESS',
    histories: [
      [
        { event: 'footage_verified', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'send_cut_to_client', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'shoot_checkin', timestamp: '2001-07-01T08:00:00.000Z' },
        { event: 'shoot_wrap', timestamp: '2001-05-01T08:00:00.000Z' },
        { event: 'shoot_checkout', timestamp: '2001-05-01T08:00:00.000Z' },
        { event: 'cut_approved_by_client', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'shoot_wrap', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'revisions_sent', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'preproduction_kickoff', timestamp: '2001-01-02T08:00:00.000Z' },
      ],
      [
        { event: 'shoot_checkin', timestamp: '2001-07-01T08:00:00.000Z' },
      ],
    ],
  }, {
    stage: 'FOOTAGE_UPLOADED',
    histories: [
      [
        { event: 'footage_verified', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'send_cut_to_client', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'confirm_footage_uploaded', timestamp: '2001-07-01T08:00:00.000Z' },
        { event: 'cut_approved_by_client', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'shoot_wrap', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'revisions_sent', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'preproduction_kickoff', timestamp: '2001-01-02T08:00:00.000Z' },
      ],
      [
        { event: 'confirm_footage_uploaded', timestamp: '2001-07-01T08:00:00.000Z' },
      ],
    ],
  }, {
    stage: 'FOOTAGE_VERIFIED',
    histories: [
      [
        { event: 'footage_verified', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'send_cut_to_client', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'footage_verified', timestamp: '2001-07-01T08:00:00.000Z' },
        { event: 'cut_approved_by_client', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'shoot_wrap', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'revisions_sent', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'preproduction_kickoff', timestamp: '2001-01-02T08:00:00.000Z' },
      ],
      [
        { event: 'footage_verified', timestamp: '2001-07-01T08:00:00.000Z' },
      ],
    ],
  }, {
    stage: 'EDITOR_WORKING_ON_CUT',
    histories: [
      [
        { event: 'footage_verified', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'send_cut_to_client', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'revisions_sent', timestamp: '2001-07-01T08:00:00.000Z' },
        { event: 'cut_approved_by_client', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'shoot_wrap', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'revisions_sent', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'preproduction_kickoff', timestamp: '2001-01-02T08:00:00.000Z' },
      ],
      [
        { event: 'revisions_sent', timestamp: '2001-07-01T08:00:00.000Z' },
      ],
    ],
  }, {
    stage: 'CUT_UPLOADED',
    histories: [
      [
        { event: 'footage_verified', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'send_cut_to_client', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-07-01T08:00:00.000Z' },
        { event: 'cut_approved_by_client', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'shoot_wrap', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'revisions_sent', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'preproduction_kickoff', timestamp: '2001-01-02T08:00:00.000Z' },
      ],
      [
        { event: 'cut_uploaded', timestamp: '2001-07-01T08:00:00.000Z' },
      ],
    ],
  }, {
    stage: 'CUT_SENT_TO_CLIENT',
    histories: [
      [
        { event: 'footage_verified', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'send_cut_to_client', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'send_cut_to_client', timestamp: '2001-07-01T08:00:00.000Z' },
        { event: 'cut_approved_by_client', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'shoot_wrap', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'revisions_sent', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'preproduction_kickoff', timestamp: '2001-01-02T08:00:00.000Z' },
      ],
      [
        { event: 'send_cut_to_client', timestamp: '2001-07-01T08:00:00.000Z' },
      ],
    ],
  }, {
    stage: 'CLIENT_RESPONDED_TO_CUT',
    histories: [
      [
        { event: 'footage_verified', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'send_cut_to_client', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'feedback_submitted_by_client', timestamp: '2001-07-01T08:00:00.000Z' },
        { event: 'cut_approved_by_client', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'shoot_wrap', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'revisions_sent', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'preproduction_kickoff', timestamp: '2001-01-02T08:00:00.000Z' },
      ],
      [
        { event: 'feedback_submitted_by_client', timestamp: '2001-07-01T08:00:00.000Z' },
      ],
    ],
  }, {
    stage: 'CLIENT_APPROVED_CUT',
    histories: [
      [
        { event: 'footage_verified', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'send_cut_to_client', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'cut_approved_by_client', timestamp: '2001-07-01T08:00:00.000Z' },
        { event: 'cut_approved_by_client', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'shoot_wrap', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: '', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'preproduction_kickoff', timestamp: '2001-01-02T08:00:00.000Z' },
      ],
      [
        { event: 'cut_approved_by_client', timestamp: '2001-07-01T08:00:00.000Z' },
      ],
    ],
  }, {
    stage: 'PROJECT_WRAPPED',
    histories: [
      [
        { event: 'shoot_wrap', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'preproduction_kickoff', timestamp: '2001-01-02T08:00:00.000Z' },
        { event: 'project_wrap', timestamp: '2001-04-01T08:00:00.000Z' },
      ],
      [
        { event: 'project_wrap', timestamp: '2001-04-01T08:00:00.000Z' },
      ],
      [
        { event: 'project_wrap', timestamp: '2001-01-01T08:00:00.000Z' },
        { event: 'shoot_wrap', timestamp: '2001-02-01T08:00:00.000Z' },
        { event: 'cut_uploaded', timestamp: '2001-03-01T08:00:00.000Z' },
        { event: 'preproduction_kickoff', timestamp: '2001-01-02T08:00:00.000Z' },
      ],
    ],
  },
]);

describe('project model', () => {
  before(() => {
    insertTestData();
  });
  describe('immutable factory', () => {
    it('should combine shoot, cut, and deliverable events into complete history', () => {
      const projectId = '11123222';
      const cutOneTemplate = sample_cuts[0];
      const cutTwoTemplate = sample_cuts[1];
      const deliverableTemplate = sample_deliverables[0];
      const shootTemplate = sample_shoots[0];
      const projectTemplate = sample_projects[0];

      const combinedHistories = [
        EXAMPLE_HISTORIES.get(0).histories[0],
        EXAMPLE_HISTORIES.get(1).histories[0],
        EXAMPLE_HISTORIES.get(1).histories[1],
        EXAMPLE_HISTORIES.get(2).histories[0],
        EXAMPLE_HISTORIES.get(2).histories[1],
      ];

      projectTemplate._id = projectId;
      deliverableTemplate.projectId = projectTemplate._id;
      shootTemplate.projectId = projectTemplate._id;
      cutOneTemplate.deliverableId = deliverableTemplate._id;
      cutTwoTemplate.deliverableId = deliverableTemplate._id;

      [cutOneTemplate, cutTwoTemplate, deliverableTemplate, projectTemplate, shootTemplate].forEach((template, i) => {
        template.history = combinedHistories[i];
      });

      Cut.createNew(cutOneTemplate).save();
      Cut.createNew(cutTwoTemplate).save();
      Shoot.createNew(shootTemplate).save();
      Deliverable.createNew(deliverableTemplate).save();
      const project = Project.createNew(projectTemplate);

      const completeHistory = project.completeRecordAndChildrenHistory.toArray();
      const flatCombined = _.flatten(combinedHistories);
      expect(flatCombined.length).to.equal(completeHistory.length);

      const historyEvents = completeHistory.map(e => e.event).sort();
      const flatCombinedEvents = flatCombined.map(e => e.event).sort();
      expect(flatCombinedEvents).to.deep.equal(historyEvents);

      // expect it to be sorted already by timestamp
      const unsorted = completeHistory.map(e => e.timestamp);
      const sorted = unsorted.sort();
      expect(unsorted).to.deep.equal(sorted);
    });

    it('should return correct latest key event', (done) => {
      let project;
      let projectTemplate;
      EXAMPLE_HISTORIES.forEach((example) => {
        example.histories.forEach((h) => {
          sample_projects.forEach((p) => {
            projectTemplate = p;
            projectTemplate.history = h;
            projectTemplate._id = 'fakeId';
            project = Models.Project.createNew(projectTemplate);
            expect(example.stage).to.equal(project.latestKeyEvent);
            expect(project.latestKeyEventLabel).to.exist;
          });
        });
      });
      done();
    });
  });

  describe('schema', () => {
    it('should be able to set the blueprint', () => {
      let project = Project.createNew({});
      const blueprint = 'CUSTOMER_TESTIMONIAL';
      project = project.set('blueprint', blueprint);
      expect(project.blueprint).to.equal(blueprint);
    });

    it('should calculate stages correctly', () => {
      EXAMPLE_HISTORIES.forEach((example) => {
        example.histories.forEach((h) => {
          expect(calculateStage(h)).to.equal(example.stage);
        });
      });
    });
  });
});
