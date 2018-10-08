
import { SimpleSchemaWrapper } from 'firstcut-schema';
import { Map } from 'immutable';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getRecordUrl } from 'firstcut-retrieve-url';
import moment from 'moment';

const key = 'generate_booking_invoices';

const GenerateBookingInvoices = new Map({
  key,
  action_title: 'Generate Booking Invoices',
  completed_title: 'Generated booking invoices',
  customFieldsSchema: new SimpleSchemaWrapper({
    generateInterviewerBookingInvoice: {
      type: Boolean,
      defaultValue: true,
    },
    generateVideographerBookingInvoice: {
      type: Boolean,
      defaultValue: true,
    },
  }),
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
    // return true;
    if (!record.date || !record.timezone) {
      return true;
    }
    const dayOfShoot = moment.tz(record.date, record.timezone);
    return moment().isBefore(dayOfShoot);
  },
  generateActions(Models, eventData) {
    const {
      record_id,
      generateVideographerBookingInvoice,
      generateInterviewerBookingInvoice,
      initiator_player_id,
    } = eventData;
    const shoot = Models.getRecordFromId('Shoot', record_id);

    return [
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `Generated booking invoices for ${shoot.projectDisplayName} ( ${getRecordUrl(shoot)} )`,
        },
      }, {
        type: ACTIONS.custom_function,
        title: 'generate booking invoices and set them to due',
        execute: () => {
          const bookingInvoices = [];
          if (shoot.videographer && generateVideographerBookingInvoice === 'true') {
            bookingInvoices.push(shoot.generateBookingInvoice(shoot.videographer));
          }
          if (shoot.interviewer && generateInterviewerBookingInvoice === 'true') {
            bookingInvoices.push(shoot.generateBookingInvoice(shoot.interviewer));
          }
          bookingInvoices.forEach((i) => {
            let invoice = i;
            if (invoice) {
              invoice = invoice.markAsDue();
            }
            invoice.save();
          });
        },
      }];
  },
});

export default GenerateBookingInvoices;
