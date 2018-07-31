
import {EVENT_LABELS} from 'firstcut-enum';
import {DELIVERABLE_BLUEPRINTS} from 'firstcut-blueprints';
import { _ } from 'lodash';
import {List} from 'immutable';

export default function DeliverableFactory(Base, schema) {
  class Deliverable extends Base {
    static get collection_name() { return 'deliverables'; }

    newInvoice() {
      return this.invoiceService.createNew({gigId: this._id, type: 'DELIVERABLE'});
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
      return this.projectDirectory + 'deliverable_assets';
    }

    get displayName() {return `${this.projectDisplayName} ${this.name || ''} - ${this.blueprintLabel}`; }
    get project() { return this.projectService.fromId(this.projectId);}
    get company() {return (this.project) ? this.project.company: null;}
    get adminOwner() {return (this.project) ? this.project.adminOwner: null;}
    get clientOwner() { return this.clientService.fromId(this.clientOwnerId); }
    get postpoOwner() { return this.collaboratorService.fromId(this.postpoOwnerId); }

    get projectDirectory() { return (this.project) ? this.project.projectDirectory : '';}
    get adminOwnerSlackHandle() { return (this.adminOwner) ? this.adminOwner.slackHandle : '';}
    get postpoOwnerSlackHandle() { return (this.postpoOwner) ? this.postpoOwner.slackHandle : '';}

    get adminOwnerFirstName() { return (this.adminOwner) ? this.adminOwner.firstName : '';}
    get postpoOwnerFirstName() { return (this.postpoOwner) ? this.postpoOwner.firstName : '';}

    get adminOwnerDisplayName() { return (this.adminOwner) ? this.adminOwner.displayName : '';}
    get postpoOwnerDisplayName() { return (this.postpoOwner)? this.postpoOwner.displayName: ''}

    get cuts() { return this.cutService.find({deliverableId: this._id}); }
    get latestCut() {
      const sorted = _.sortBy(this.cuts.toArray(), ['createdAt']);
      return _.last(sorted);
    }

    get hasBeenKickedOff() {return this.eventsInHistory.includes('deliverable_kickoff');}

    get entireHistory() {
      const cut_history = this.cuts.toArray().map(cut => {
        return cut.history.map(event => {
          if (event.toJS) {
            event = event.toJS();
          }
          event.title = EVENT_LABELS[event.event] + " -- " + cut.versionDisplayName;
          return event;
        })
      });
      let all_events = _.flatten(cut_history);
      all_events = [...this.history.toArray(), ..._.flatten(cut_history)];
      const sorted = _.sortBy(all_events, ['timestamp']);
      return new List(sorted);
    }

  }

  Deliverable.schema = schema;
  Deliverable.available_blueprints = DELIVERABLE_BLUEPRINTS;
  return Deliverable;
}
