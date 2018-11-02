import { _ } from 'lodash';
import { List } from 'immutable';
import { EVENT_LABELS } from 'firstcut-pipeline-consts';
import { eventsInHistory } from 'firstcut-action-utils';
import { createFirstCutModel } from 'firstcut-model-base';
import { STAGES } from './projects.enum';
import PROJECT_BLUEPRINTS from './projects.blueprints';
import ProjectSchema from './projects.schema';

const Base = createFirstCutModel(ProjectSchema);

class Project extends Base {
  static get collectionName() {
    return 'projects';
  }

  static get schema() { return ProjectSchema; }

  filesRoot(field) {
    if (field === 'projectArchive') {
      return `${this.projectDirectory}archive`;
    }
    return `${this.projectDirectory}project_assets`;
  }

  newCompany() {
    return this.companyService.createNew({});
  }

  newClient() {
    return this.clientService.createNew({});
  }

  newAdminOwner() {
    return this.collaboratorService.createNew({});
  }

  newShoot() {
    return this.shootService.createNew({ projectId: this._id, isDummy: this.isDummy });
  }

  newInvoice() {
    return this.invoiceService.createNew({ gigId: this._id, type: 'PROJECT' });
  }

  getProjectMessages() {
    return this.messageService.find({ projectId: this._id });
  }

  addNewMessage(text) {
    const message = this.messageService.createNew({
      text,
      projectId: this._id,
      authorId: Meteor.userId(),
      readBy: [Meteor.userId()],
    });
    message.save();
  }

  getCompleteRecordAndChildrenTasks(options) {
    const deliverables = this.getDeliverables().toArray();
    let deliverableTasks = deliverables.map(d => d.getRelatedTasks(options).toArray());
    let cutTasks = this.getAllCuts().toArray().map(c => c.getRelatedTasks(options).toArray());
    const shoots = this.getShoots().toArray();
    let shootsTasks = shoots.map(s => s.getRelatedTasks(options).toArray());
    shootsTasks = _.flatten(shootsTasks);
    deliverableTasks = _.flatten(deliverableTasks);
    cutTasks = _.flatten(cutTasks);
    const allTasks = [
      ...this.getRelatedTasks(options).toArray(),
      ...shootsTasks,
      ...deliverableTasks,
      ...cutTasks,
    ];
    return new List(allTasks);
  }


  get completeRecordAndChildrenHistory() {
    const processChildEvent = (event, genTitle) => {
      let e = event;
      if (e.toJS) {
        e = e.toJS();
      }
      e.title = genTitle(e);
      return e;
    };
    const deliverables = this.getDeliverables().toArray();
    let deliverableHistory = deliverables.map(d => d.completeRecordAndChildrenHistory.toArray().map((event) => {
      const genTitle = e => `${EVENT_LABELS[e.event]} -- ${d.displayName}`;
      return processChildEvent(event, genTitle);
    }));
    const shoots = this.getShoots().toArray();
    let shootsHistory = shoots.map(s => s.history.map((event) => {
      const genTitle = e => `${EVENT_LABELS[e.event]} -- ${s.displayName}`;
      return processChildEvent(event, genTitle);
    }));
    shootsHistory = _.flatten(shootsHistory);
    deliverableHistory = _.flatten(deliverableHistory);
    const allEvents = [...this.historyAsArray, ...shootsHistory, ...deliverableHistory];
    const sorted = _.sortBy(allEvents, ['timestamp']);
    return new List(sorted);
  }

  hasBeenWrapped() {
    return this.eventsInHistory.includes('project_wrap');
  }

  getShoots() {
    return this.shootService.find({ projectId: this._id });
  }

  getDeliverables() {
    return this.deliverableService.find({ projectId: this._id });
  }

  getAdditionalClientTeamMembers() {
    if (!this.additionalClientTeamMemberIds) {
      return new List();
    }
    return new List(this.additionalClientTeamMemberIds.map(_id => this.clientService.fromId(_id)));
  }

  getClientTeamMembersNotYetInvited() {
    return this.getEntireClientTeam().filter(c => !c.hasBeenInvitedToPlatform() && !c.hasUserProfile);
  }

  getEntireClientTeam() {
    return [this.clientOwner, ...this.getAdditionalClientTeamMembers()];
  }

  getAllCuts() {
    let cuts = this.getDeliverables().toArray().map(d => d.getCuts().toArray());
    cuts = _.flatten(cuts);
    return new List(cuts);
  }

  getLatestCuts() {
    let cuts = this.getDeliverables().toArray().map(d => d.getLatestCut());
    cuts = cuts.filter(c => c != null);
    return new List(cuts);
  }

  isWrapped() { return this.getLatestKeyEvent() === 'PROJECT_WRAPPED'; }

  get displayName() {
    let isDummy = '';
    if (this.isDummy) isDummy = '(DUMMY)';
    return `${this.companyDisplayName} - ${this.name} ${isDummy}`;
  }

  get projectDirectory() {
    return `projects/${this._id}/`;
  }

  get clientOwner() {
    return this.clientService.fromId(this.clientOwnerId);
  }

  get adminOwner() {
    return this.collaboratorService.fromId(this.adminOwnerId);
  }

  getLatestKeyEvent() {
    const history = this.completeRecordAndChildrenHistory.toArray();
    if (history && history.length === 0) {
      return this.get('stage');
    }
    const stage = calculateStage(history);
    return stage;
  }

  get company() {
    return this.companyService.fromId(this.companyId);
  }

  get latestKeyEventLabel() {
    return STAGES[this.getLatestKeyEvent()];
  }
}

Project.availableBlueprints = PROJECT_BLUEPRINTS;

export function calculateStage(h) {
  let history = h;
  // ensure the history is sorted by timestamp
  history = _.reverse(_.sortBy(history, ['timestamp']));
  const events = eventsInHistory(history);
  const findLatestEvent = (historyToSearch, eventsToFind) => {
    const latest = _.find(historyToSearch, e => eventsToFind.includes(e.event));
    return (latest) ? latest.event : null;
  };
  const keyEvents = [
    'revisions_sent',
    'cut_uploaded',
    'cut_approved_by_client',
    'feedback_submitted_by_client',
    'send_cut_to_client',
    'shoot_checkin',
    'shoot_wrap',
    'confirm_footage_uploaded',
    'preproduction_kickoff',
    'deliverable_kickoff',
    'footage_verified',
  ];
  const latestKeyEvent = findLatestEvent(history, keyEvents);
  if (events.includes('project_wrap')) {
    return 'PROJECT_WRAPPED';
  }

  switch (latestKeyEvent) {
    case 'revisions_sent':
      return 'EDITOR_WORKING_ON_CUT';
    case 'cut_approved_by_client':
      return 'CLIENT_APPROVED_CUT';
    case 'feedback_submitted_by_client':
      return 'CLIENT_RESPONDED_TO_CUT';
    case 'send_cut_to_client':
      return 'CUT_SENT_TO_CLIENT';
    case 'cut_uploaded':
      return 'CUT_UPLOADED';
    case 'confirm_footage_uploaded':
      return 'FOOTAGE_UPLOADED';
    case 'footage_verified':
      return 'FOOTAGE_VERIFIED';
    case 'shoot_wrap':
      return 'SHOOT_COMPLETED';
    case 'shoot_checkin':
      return 'SHOOT_IN_PROGRESS';
    case 'deliverable_kickoff':
      return 'POSTPRODUCTION_KICKOFF';
    case 'preproduction_kickoff':
      return 'SHOOT_READY';
    default:
      return 'BOOKING';
  }
}

export default Project;
