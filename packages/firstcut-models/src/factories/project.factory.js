import {PROJECT_STAGES, EVENTS} from 'firstcut-enum';
import {PROJECT_BLUEPRINTS} from 'firstcut-blueprints';

export default function ProjectFactory(Base, schema) {
  class Project extends Base {

    static get collection_name() {
      return 'projects'
    }

    filesRoot(field) {
      return this.projectDirectory + 'project_assets';
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
      return this.shootService.createNew({projectId: this._id, isDummy: this.isDummy});
    }
    newInvoice() {
      return this.invoiceService.createNew({gigId: this._id, type: 'PROJECT'});
    }

    generateDependentRecords() {
      if (!this.adminOwnerId) {
        return [];
      }
      let invoice = this.newInvoice();
      invoice = invoice.set('payeeId', this.adminOwnerId);
      return [invoice];
    }

    get displayName() {
      let is_dummy = '';
      if (this.isDummy)
        is_dummy = '(DUMMY)';
      return `${this.companyDisplayName} - ${this.name} ` + is_dummy;
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
    get company() {
      return this.companyService.fromId(this.companyId);
    }
    get shoots() {
      return this.shootService.find({projectId: this._id});
    }
    get deliverables() {
      return this.deliverableService.find({projectId: this._id});
    }
    get stageLabel() {
      return (this.stage)
        ? PROJECT_STAGES[this.stage]
        : "";
    }
    get hasBeenWrapped() {
      return this.eventsInHistory.includes('project_wrap');
    }
  }

  Project.schema = schema;
  Project.available_blueprints = PROJECT_BLUEPRINTS;
  return Project;
}
