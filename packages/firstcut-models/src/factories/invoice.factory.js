
import { humanReadableDate } from 'firstcut-utils';
import { INVOICE_TYPES , INVOICE_STATUS } from 'firstcut-enum';

export default function InvoiceFactory(Base, schema) {
  class Invoice extends Base {

    static get collection_name() { return 'invoices'; }

    markAsDue() { return this.set('status', 'DUE');}
    markAsPaid() { return this.set('status', 'PAID');}

    get typeLabel() { return INVOICE_TYPES[this.type];}
    get displayName() { return `${this.typeLabel}`;}

    get gigService() {
      switch(this.type) {
        case 'DELIVERABLE':
          return this.deliverableService;
        case 'PROJECT':
          return this.projectService;
        case 'SHOOT':
          return this.shootService;
      }
    }

    get payee() {return this.collaboratorService.fromId(this.payeeId);}
    get gig() {return this.gigService.fromId(this.gigId);}

    get adminOwnerDisplayName() {return (this.gig) ? this.gig.adminOwnerDisplayName: '';}
    get gigDisplayName() {return (this.gig) ? this.gig.displayName: "";}
    get payeeDisplayName() {return (this.payee) ? this.payee.displayName: "";}
    get statusLabel() { return INVOICE_STATUS[this.status]; }
    get datePaid() { return this.date_paid; }

    get paid() { return this.status == 'PAID';}
  }

  Invoice.schema = schema;
  return Invoice;
}
