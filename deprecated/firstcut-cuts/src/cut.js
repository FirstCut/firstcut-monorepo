
import { _ } from 'lodash';
import { EVENTS } from 'firstcut-pipeline-consts';
import { createFirstCutModel } from 'firstcut-model-base';
import { CUT_TYPES } from './cuts.enum';
import CutSchema from './cuts.schema';

const Base = createFirstCutModel(CutSchema);

class Cut extends Base {
  static get collectionName() {
    return 'cuts';
  }

  static get schema() { return CutSchema; }

  filesRoot(field) {
    return `${this.projectDirectory}cuts`;
  }

  getDeliverableName() {
    return this.deliverable.name || '';
  }

  isFullInterview() { return this.type === 'FULL_INTERVIEW'; }

  isFirstCut() { return this.type === 'FIRST_CUT'; }

  isRevisionsCut() { return this.type === 'REVISIONS_CUT'; }

  isFinalCut() { return this.type === 'FINAL_CUT'; }

  isExtraCut() { return this.type === 'EXTRA_CUT'; }

  isSnippet() { return this.type === 'SNIPPET'; }

  isLatestCut() {
    const latest = this.deliverable.getLatestCut();
    return latest && latest._id === this._id;
  }

  deliverableHasApprovedCut() {
    return this.deliverable.approvedCut() != null;
  }

  get projectDirectory() {
    if (!this.project) {
      throw new Meteor.Error('requirements-not-fulfilled', 'Project is required in order to upload files for this document');
    }
    return this.project.projectDirectory;
  }

  get hasFile() {
    return this.fileId || this.fileUrl;
  }

  get brandIntroId() {
    return (this.company)
      ? this.company.brandIntroId
      : '';
  }

  get displayName() {
    return `${this.deliverableDisplayName} (${this.typeLabel})`;
  }

  get typeLabel() {
    return CUT_TYPES[this.type];
  }

  get deliverable() {
    return (this.deliverableId)
      ? this.deliverableService.fromId(this.deliverableId)
      : null;
  }

  get deliverableDisplayName() {
    return (this.deliverable)
      ? this.deliverable.displayName
      : '';
  }

  get postpoOwnerDisplayName() {
    return (this.postpoOwner)
      ? this.postpoOwner.displayName
      : '';
  }

  get adminOwnerDisplayName() {
    return (this.adminOwner)
      ? this.adminOwner.displayName
      : '';
  }

  get postpoOwner() {
    return (this.deliverable)
      ? this.deliverable.postpoOwner
      : null;
  }

  get adminOwner() {
    return (this.deliverable)
      ? this.deliverable.adminOwner
      : null;
  }

  get clientOwner() {
    return (this.deliverable)
      ? this.deliverable.clientOwner
      : null;
  }

  get project() {
    return (this.deliverable)
      ? this.deliverable.project
      : null;
  }

  get company() {
    return (this.project)
      ? this.project.company
      : null;
  }

  get versionDisplayName() {
    return `v${this.version}`;
  }

  get hasBrandIntro() {
    return (this.company)
      ? this.company.hasBrandIntro
      : false;
  }

  get hasBeenVerified() {
    return this.eventsInHistory.includes(EVENTS.has_been_sent_to_client);
  }

  get hasBeenApprovedByClient() {
    return this.eventsInHistory.includes(EVENTS.cut_approved_by_client);
  }

  get cutHasBeenSentToClient() {
    return this.eventsInHistory.includes(EVENTS.send_cut_to_client);
  }

  get hasVerifiedRevisions() {
    return this.eventsInHistory.includes(EVENTS.revisions_sent);
  }

  get clientHasSubmittedFeedback() {
    return this.eventsInHistory.includes(EVENTS.feedback_submitted_by_client) || this.hasVerifiedRevisions;
  }

  get clientSubmittedFeedbackEvent() {
    return _.first(this.getEventsOfType(EVENTS.feedback_submitted_by_client));
  }
}

export default Cut;
