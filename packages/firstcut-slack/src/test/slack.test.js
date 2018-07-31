
import { stubUser } from '/imports/api/testing-utils';
import { MeteorStubs } from 'meteor/velocity:meteor-stubs';
import { Deliverable, Project, Cut, Shoot, Collaborator, Client } from 'firstcut-models';
import { postMessage, getMessageContent } from '../slack.js';
import { WebClient } from '@slack/client';
import { template_generators, TEMPLATES, SlackTemplateSchema, getChannel } from '../slack.enum.js';
import { insertTestData, restoreTestData, DELIVERABLE_ID, POSTPO_OWNER_ID, PROJECT_ID, CLIENT_OWNER_ID_FOR_DELIVERABLE, validateAgainstSchema } from '/imports/api/testing-utils';
import { sample_clients, sample_collaborators, sample_cuts, sample_projects, sample_deliverables } from '/imports/api/testing-utils';
import sinon from 'sinon';
import { Record } from 'immutable';

var sandbox = sinon.createSandbox({});

describe('slack', function() {
  before(function() {
    MeteorStubs.install();
  });

  after(function() {
    MeteorStubs.uninstall();
    // restoreTestData();
  });

  describe('getMessageContent', function() {
    afterEach(function () {
      sandbox.restore();
    });
    it('should throw validation error when template not supported', function() {
      try {
        const result = getMessageContent('fake-template', {'deliverable_id': 'fake'});
      } catch (e) {
        expect(e.error).to.equal('validation-error');
        expect(e.details[0].name).to.equal('template');
        expect(e.details).to.have.length(1);
      }
    });
    it('should not throw error when template supported', function() {
        for (template of Object.values(TEMPLATES)) {
          try {
            const result = getMessageContent(template, {deliverable_id: 'fake'});
          } catch (e) {
            expect(e).to.equal(undefined);
          }
        }
    });
  });

  describe('template generators', function() {
    it('should have a generator function defined for each template', function() {
      const generator_keys = Object.keys(template_generators);
      const templates = Object.values(TEMPLATES);
      expect(generator_keys).to.include.all.members(templates);
    });

    it('should return json that validates against the SlackTemplateSchema', function() {
      for (generator of Object.values(template_generators)) {
        let result = generator({deliverable_id: 'fake_id'});
        result.channel = getChannel();
        expect(validateAgainstSchema.bind(this, result, SlackTemplateSchema)).to.not.throw();
      }
    });
  });
});
