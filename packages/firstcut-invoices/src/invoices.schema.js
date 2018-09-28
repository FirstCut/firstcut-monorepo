import { SimpleSchemaWrapper as Schema } from '/imports/api/schema';
import { INVOICE_TYPES, INVOICE_STATUS } from './invoices.enum';
import BaseSchema from '/imports/api/schema/base.schema';

const InvoiceSchema = new Schema({
  type: {
    type: String,
    required: true,
    label: 'Gig Type',
    enumOptions: INVOICE_TYPES,
  },
  status: {
    type: String,
    enumOptions: INVOICE_STATUS,
    sortBy: 'off',
    defaultValue: 'NOT_DUE',
    required: true,
  },
  gigId: {
    type: String,
    label: 'Gig',
    required: true,
  },
  payerId: {
    type: String,
    label: 'Client',
    serviceDependency: 'Client',
  },
  payeeId: {
    type: String,
    label: 'Payee',
    serviceDependency: 'COLLABORATOR',
  },
  transactionId: {
    type: String,
  },
  date_due: {
    type: Date,
    autoValue() {
      const status = this.siblingField('status');
      const due = status.isSet && status.value == 'DUE';
      if (!this.isSet && due) {
        return new Date();
      }
    },
  },
  date_paid: {
    type: Date,
    autoValue() {
      const status = this.siblingField('status');
      const paid = status.isSet && status.value == 'PAID';
      if (!this.isSet && paid) {
        return new Date();
      }
    },
  },
  amount: {
    type: Number, // TODO: check that this allows for floats or maybe even use SimpleSchema.
    defaultValue: 0,
    required: true,
  },
  note: {
    type: String,
    label: 'Note',
  },
});

InvoiceSchema.extend(BaseSchema);

export default InvoiceSchema;
