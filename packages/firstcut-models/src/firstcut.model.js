import {BaseModel} from './base.model.js';
import {LocationParser} from 'firstcut-schema-builder';

export const FirstCutModel = defaultValues => class extends BaseModel({
  ...defaultValues
}) {

  static get available_blueprints() {
    return this._blueprints;
  }
  static set available_blueprints(blueprints) {
    this._blueprints = blueprints;
    this.schema.setBlueprintOptions(blueprints);
  }
  static validate(record) {
    const unique_fields = this.schema.unique_fields;
    unique_fields.map(field => {
      if (record[field]) {
        if (this.findOne({_id: {$ne: record._id}, [field]: record[field]})) {
          throw new ValidationError([{
            name: field,
            type: 'value must be unique',
            message: `A record with ${field} ${record[field]} already exists`
          }]);
        }
      }
    })
    this.schema.validate(record);
  }
  static validator() { this.schema.validator(); }

  generateDependentRecords() { return []; } // inheritors can override this

  get blueprintLabel() {
    return (this.blueprint)
      ? this.constructor.available_blueprints[this.blueprint].label
      : "";
  }

  get available_blueprints() {
    return this.constructor.available_blueprints;
  }
  get eventsInHistory() {
    return this.history.map(event => event.event);
  }
  get invoiceCount() {
    return (this.invoices)
      ? this.invoices.count()
      : 0;
  }
  get invoices() {
    const type = this.legacy_model_name;
    const gigId = this._id;
    return this.invoiceService.find({gigId, type});
  }
  get locationUrl() {
    return LocationParser.locationUrl(this)
  }
  get locationDisplayName() {
    return LocationParser.locationDisplayName(this)
  }
  get cityDisplayName() {
    return LocationParser.cityDisplayName(this)
  }
  get projectDisplayName() {
    return (this.project)
      ? this.project.displayName
      : ''
  }
  get clientDisplayName() {
    return (this.client)
      ? this.client.displayName
      : ''
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
      : "";
  }
  get clientOwnerDisplayName() {
    return (this.clientOwner)
      ? this.clientOwner.displayName
      : "";
  }
  get postpoOwnerEmail() {
    return (this.postpoOwner)
      ? this.postpoOwner.email
      : '';
  }
  get adminOwnerEmail() {
    return (this.adminOwner)
      ? this.adminOwner.email
      : "";
  }
  get clientOwnerEmail() {
    return (this.clientOwner)
      ? this.clientOwner.email
      : "";
  }
  get companyDisplayName() {
    return (this.company)
      ? this.company.displayName
      : "";
  }

  appendToHistory(event_data) {
    let self = this.nestedStructuresToImmutables();
    const result = self.addSubobjectToSubarray('history', event_data);
    return result;
  }

  getEventsOfType(event_name) {
    return this.history.toArray().filter(event => event.event == event_name);
  }

  getEventId(event_name) {
    return this._getHistoryField({event_name, field: 'event_id'});
  }

  _getHistoryField({event_name, field}) {
    const events = this.getEventsOfType(event_name);
    const with_field = _.first(events.filter(event => event[field] != null));
    return (with_field)
      ? with_field[field]
      : null;
  }
}

function applyBlueprint(record, blueprint) {
  if (!blueprint) {
    throw new Meteor.Error('malformed-params', 'Cannot apply blueprint when blueprint is undefined or null');
  }
  if (!record.available_blueprints) {
    throw new Meteor.Error('malformed-params', 'Record does not have available blueprints assigned to it. Cannot apply blueprint');
  }
  if (!record.available_blueprints[blueprint]) {
    throw new Meteor.Error('malformed-params', `Blueprint ${blueprint} not one of record's available blueprints`);
  }
  const defaults = record.available_blueprints[blueprint].defaults;
  Object.keys(defaults).forEach(key => record = record.set(key, defaults[key]))
  return record;
}
