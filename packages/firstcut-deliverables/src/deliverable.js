
import { EVENT_LABELS } from 'firstcut-pipeline-consts';
import DELIVERABLE_BLUEPRINTS from './deliverables.blueprints';
import { _ } from 'lodash';
import { List } from 'immutable';
import DeliverableSchema from './deliverables.schema';
import { createFirstCutModel } from 'firstcut-model-base';

const Base = createFirstCutModel(DeliverableSchema);

class Deliverable extends Base {
  static get collectionName() { return 'deliverables'; }

  static get schema() { return DeliverableSchema; }

  newInvoice() {
    return this.invoiceService.createNew({ gigId: this._id, type: 'DELIVERABLE' });
  }

  generateDependentRecords() {
    if (!this.postpoOwnerId) {
      return [];
    }
    let invoice = this.newInvoice();
    invoice = invoice.set('payeeId', this.postpoOwnerId);
    return [invoice];
  }

  filesRoot(field) {
    return `${this.projectDirectory}deliverable_assets`;
  }

  isWrapped() {
    return this.project.isWrapped();
  }

  approvedCut() {
    if (!this.approvedCutId) {
      return null;
    }
    return this.cutService.fromId(this.approvedCutId);
  }

  get displayName() { return `${this.projectDisplayName} ${this.name || ''}`; }

  get project() { return this.projectService.fromId(this.projectId); }

  get company() { return (this.project) ? this.project.company : null; }

  get adminOwner() { return (this.project) ? this.project.adminOwner : null; }

  get clientOwner() { return this.clientService.fromId(this.clientOwnerId); }

  get postpoOwner() { return this.collaboratorService.fromId(this.postpoOwnerId); }

  get projectDirectory() { return (this.project) ? this.project.projectDirectory : ''; }

  get adminOwnerFirstName() { return (this.adminOwner) ? this.adminOwner.firstName : ''; }

  get postpoOwnerFirstName() { return (this.postpoOwner) ? this.postpoOwner.firstName : ''; }

  get adminOwnerDisplayName() { return (this.adminOwner) ? this.adminOwner.displayName : ''; }

  get postpoOwnerDisplayName() { return (this.postpoOwner) ? this.postpoOwner.displayName : ''; }

  hasCutOfType(cutType) {
    const existingCutTypes = this.getCuts().toArray().map(c => c.type);
    return existingCutTypes.includes(cutType);
  }

  getNextCutTypeDue() {
    const CUT_TYPE_ORDER = ['FIRST_CUT', 'REVISIONS_CUT', 'FINAL_CUT', 'EXTRA_CUT'];
    const latestType = (this.getLatestCut()) ? this.getLatestCut().type : null;
    if (!latestType) {
      return CUT_TYPE_ORDER[0];
    }
    const latestIndex = CUT_TYPE_ORDER.indexOf(latestType);
    if (latestIndex === CUT_TYPE_ORDER.length - 1) {
      return null;
    }
    return CUT_TYPE_ORDER[latestIndex + 1];
  }

  getCuts() { return this.cutService.find({ deliverableId: this._id }); }

  getLatestCut() {
    const sorted = _.sortBy(this.getCuts().toArray(), ['createdAt']);
    return _.last(sorted);
  }

  hasBeenKickedOff() { return this.eventsInHistory.includes('deliverable_kickoff'); }

  get completeRecordAndChildrenHistory() {
    const cuts = this.getCuts().toArray();
    const cutHistory = cuts.map(cut => cut.history.map((event) => {
      let e = event;
      if (e.toJS) {
        e = e.toJS();
      }
      e.title = `${EVENT_LABELS[e.event]} -- ${cut.versionDisplayName}`;
      return e;
    }));
    let allEvents = _.flatten(cutHistory);
    allEvents = [...this.historyAsArray, ..._.flatten(cutHistory)];
    const sorted = _.sortBy(allEvents, ['timestamp']);
    return new List(sorted);
  }
}

Deliverable.availableBlueprints = DELIVERABLE_BLUEPRINTS;
export default Deliverable;
