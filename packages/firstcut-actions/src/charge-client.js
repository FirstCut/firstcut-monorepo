
import { Map } from 'immutable';
import { RecordEvents, getEmailActions } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';

const ChargeClient = new Map({
  key: 'charge_client',
  action_title: 'Pay',
  completed_title: 'Paid invoice',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
    return record.isClientBill();
  },
  generateActions(Models, eventData) {
    const { record_id, token, initiator_player_id } = eventData;
    const invoice = Models.Invoice.fromId(record_id);
    const client = invoice.getClientPayer();

    const emailActions = getEmailActions({
      recipients: [client],
      cc: [invoice.gig.adminOwner],
      template: 'client-payment-successful',
      getSubstitutionData: recipient => ({
        gig_name: invoice.gig.displayName,
        name: recipient.firstName,
        amount: invoice.amount,
      }),
    });

    return [
      ...emailActions,
      {
        type: ACTIONS.charge_invoice,
        invoice,
        token,
      },
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `CLIENT PAYMENT PROCESSED: ${invoice.gig.displayName} : ${client.displayName} from ${client.companyDisplayName} has posted a payment`,
        },
      }];
  },
});

export default ChargeClient;