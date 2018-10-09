import { _ } from 'lodash';
import { LocationParser } from 'firstcut-schema';
import { getSalesforceLink } from 'firstcut-retrieve-url';
import { eventsInHistory } from 'firstcut-action-utils';
import generateImmutableDefaults from './utils/generate-defaults';
import { BaseModel } from './base.model';

function createFirstCutModel(schema) {
  return FirstCutModel(generateImmutableDefaults(schema));
}

const FirstCutModel = defaultValues => class extends BaseModel({
  ...defaultValues,
}) {
  static get availableBlueprints() {
    return this._blueprints;
  }

  static set availableBlueprints(blueprints) {
    this._blueprints = blueprints;
    this.schema.setBlueprintOptions(blueprints);
  }

  generateDependentRecords() { return []; } // inheritors can override this

  getSalesforceLink() { return getSalesforceLink(this); }

  getLatestEvent() {
    const events = eventsInHistory(this.history);
    return _.last(events);
  }

  createNewRelatedTask() {
    return this.taskService.createNew({
      relatedRecordType: this.modelName,
      relatedRecordId: this._id,
    });
  }

  getRelatedTasks({ assignedBy, assignedTo }) {
    const query = {
      relatedRecordId: this._id,
    };
    if (assignedBy) {
      query.assignedById = assignedBy._id;
    }
    if (assignedTo) {
      query.assignedToPlayerId = assignedTo._id;
    }
    return this.taskService.find(query);
  }

  get blueprintLabel() {
    return (this.blueprint && this.constructor.availableBlueprints[this.blueprint])
      ? this.constructor.availableBlueprints[this.blueprint].label
      : '';
  }

  get availableBlueprints() {
    return this.constructor.availableBlueprints;
  }

  get invoiceCount() {
    return (this.invoices)
      ? this.invoices.count()
      : 0;
  }

  get invoices() {
    const type = this.legacyModelName;
    const gigId = this._id;
    return this.invoiceService.find({ gigId, type });
  }

  get createdBy() {
    const recordCreatedEvent = this.historyAsArray.filter(e => e.event === 'record_created');
    if (recordCreatedEvent.length > 0) {
      return recordCreatedEvent[0].initiator_player_id;
    }
    return '';
  }

  get locationUrl() {
    return LocationParser.locationUrl(this);
  }

  get historyAsArray() {
    if (!this.history) {
      return [];
    }
    return (this.history.asArray) ? this.history.asArray() : this.history;
  }

  get locationDisplayName() {
    return LocationParser.locationDisplayName(this);
  }

  get cityDisplayName() {
    return LocationParser.cityDisplayName(this);
  }

  get projectDisplayName() {
    return (this.project)
      ? this.project.displayName
      : '';
  }

  get clientDisplayName() {
    return (this.client)
      ? this.client.displayName
      : '';
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

  get clientOwnerDisplayName() {
    return (this.clientOwner)
      ? this.clientOwner.displayName
      : '';
  }

  get adminOwnerSlackHandle() {
    if (!this.adminOwner) {
      return '';
    }
    return this.adminOwner.slackHandle || this.adminOwner.firstName;
  }

  get postpoOwnerSlackHandle() {
    if (!this.postpoOwner) {
      return '';
    }
    return this.postpoOwner.slackHandle || this.postpoOwner.firstName;
  }

  get postpoOwnerEmail() {
    return (this.postpoOwner)
      ? this.postpoOwner.email
      : '';
  }

  get adminOwnerEmail() {
    return (this.adminOwner)
      ? this.adminOwner.email
      : '';
  }

  get clientOwnerEmail() {
    return (this.clientOwner)
      ? this.clientOwner.email
      : '';
  }

  get companyDisplayName() {
    return (this.company)
      ? this.company.displayName
      : '';
  }

  appendToHistory(eventData) {
    const self = this.nestedStructuresToImmutables();
    const result = self.addSubobjectToSubarray('history', eventData);
    return result;
  }

  getEventsOfType(eventName) {
    return this.history.toArray().filter(event => event.event === eventName);
  }

  getEventId(eventName) {
    return this._getHistoryField({ eventName, field: 'event_id' });
  }

  _getHistoryField({ eventName, field }) {
    const events = this.getEventsOfType(eventName);
    const withField = _.first(events.filter(event => event[field] != null));
    return (withField)
      ? withField[field]
      : null;
  }
};

export default createFirstCutModel;
