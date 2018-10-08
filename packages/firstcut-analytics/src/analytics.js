
import { EVENT_LABELS } from 'firstcut-pipeline-consts';
// import { getQualifiedSkills } from '/imports/ui/config';

const Analytics = {
  init(models, options) {
    if (options.development) {
      const analytics = {
        load() { console.log('Analytics load'); },
        page() { console.log('Analytics page'); },
        track() { console.log('Analytics track'); },
        identify() { console.log('Analytics identify'); },
        group() { console.log('Analytics group'); },
      };
    }
    analytics.load('q7fljn00pJH2VTzpOAv08t2AH5d2tfFy');
    if (models.userId()) {
      this.identifyCurrentUser();
    }
    this.models = models;
  },

  trackError(data) {
    this.track('Error', data);
  },

  trackAction(data) {
    const { event, record, ...rest } = data;
    const eventName = `Action ${EVENT_LABELS[event]}`;
    this.track(eventName, {
      event: eventName, _id: record._id, modelName: record.modelName, ...rest,
    });
  },

  trackEditRecordEvent(data) {
    const eventName = 'Editing record';
    this.track(eventName, data);
  },


  trackUploadEvent(data) {
    const eventName = 'Uploaded file';
    this.track(eventName, data);
  },

  trackClickEvent(data) {
    const { name, ...rest } = data;
    const eventName = `Clicked ${name}`;
    this.track(eventName, rest);
  },

  trackNavigationEvent(data) {
    const { name, modelName } = data;
    let pageName = name;
    if (modelName) {
      pageName = `${modelName} ${name}`;
    }
    analytics.page(pageName, data);
  },

  track(name, d) {
    const data = { ...d, userId: this.models.userId() };
    analytics.track(name, data);
  },

  identifyCurrentUser() {
    if (this.models.inSimulationMode()) {
      analytics.identify('Simulation', {
        _id: this.models.userId(),
        playerId: this.models.getPlayerIdFromUser(Meteor.user()),
        simulationPlayerId:
        this.models.userPlayerId(),
      });
      analytics.group('Simulation');
      return;
    }

    const player = this.models.userPlayer();
    if (!player) {
      analytics.identify('Anonymous', {});
      analytics.group('Anonymous');
      return;
    }

    const traits = {
      _id: this.models.userId(),
      email: player.email,
      playerId: player._id,
      name: player.displayName,
    };
    if (player.modelName === 'Client') {
      const { company, companyId } = player;
      analytics.identify(player.displayName, {

        ...traits,
        companyName: company.displayName,
        companyId,
      });
      analytics.group(company.displayName, { _id: company._id, website: company.website });
      analytics.group('Client');
    } else {
      analytics.identify(player.displayName, {
        ...traits,
        skills: player.skills,
      });
      analytics.group('Collaborator');
    }
  },
};

export default Analytics;
