
import {
  INVOICE_TYPES,
  INVOICE_STATUS,
} from './invoices.enum';
import InvoiceSchema from './invoices.schema';
import { createFirstCutModel } from '/imports/api/model-base';

const Base = createFirstCutModel(InvoiceSchema);

class Invoice extends Base {
  static get collectionName() { return 'invoices'; }

  static get schema() { return InvoiceSchema; }

  markAsDue() { return this.set('status', 'DUE'); }

  markAsPaid() { return this.set('status', 'PAID'); }

  get typeLabel() { return INVOICE_TYPES[this.type]; }

  get displayName() { return `${this.typeLabel}`; }

  get gigService() {
    switch (this.type) {
      case 'DELIVERABLE':
        return this.deliverableService;
      case 'PROJECT':
        return this.projectService;
      case 'SHOOT':
        return this.shootService;
      default:
        return this.deliverableService;
    }
  }

  isClientBill() {
    return this.payerId != null;
  }

  getClientPayer() {
    if (!this.isClientBill()) {
      return null;
    }
    return this.clientService.fromId(this.payerId);
  }

  get payee() {
    if (this.isClientBill()) {
      return null;
    }
    return this.collaboratorService.fromId(this.payeeId);
  }

  get payeePaymentMethodAsString() {
    return this.payee.paymentMethodAsString;
  }

  get gig() { return this.gigService.fromId(this.gigId); }

  get adminOwnerDisplayName() { return (this.gig) ? this.gig.adminOwnerDisplayName : ''; }

  get gigDisplayName() { return (this.gig) ? this.gig.displayName : ''; }

  get payeeDisplayName() { return (this.payee) ? this.payee.displayName : ''; }

  get statusLabel() { return INVOICE_STATUS[this.status]; }

  get datePaid() { return this.date_paid; }

  get dateDue() { return this.date_due; }

  get paid() { return this.status === 'PAID'; }

  isDue() { return this.status === 'DUE'; }
}

export default Invoice;
