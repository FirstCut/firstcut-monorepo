
import { SimpleSchemaWrapper } from 'firstcut-schema';
import { Map } from 'immutable';
import Models from 'firstcut-models';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { recordHistoryIncludesEvent } from 'firstcut-action-utils';
import { getRecordUrl } from 'firstcut-retrieve-url';
import { getPlayer } from 'firstcut-players';

const key = 'preproduction_kickoff';

const ShootReady = new Map({
  key,
  action_title: 'Shoot ready',
  completed_title: 'Shoot ready',
  customFieldsSchema: new SimpleSchemaWrapper({
    generateInterviewerHourlyInvoice: {
      type: Boolean,
      defaultValue: true,
    },
    generateVideographerHourlyInvoice: {
      type: Boolean,
      defaultValue: true,
    },
  }),
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
    return !recordHistoryIncludesEvent({ record, event: key });
  },
  generateActions(eventData) {
    const {
      record_id,
      generateVideographerHourlyInvoice,
      generateInterviewerHourlyInvoice,
      initiator_player_id,
    } = eventData;
    const shoot = Models.getRecordFromId('Shoot', record_id);
    const player = getPlayer(initiator_player_id);

    return [
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `${shoot.projectDisplayName} ( ${getRecordUrl(shoot)} ) has been marked as ready by ${player.displayName}.`,
        },
      }, {
        type: ACTIONS.custom_function,
        title: 'generate hourly invoices',
        execute: () => {
          const hourlyInvoices = [];
          if (shoot.videographer && generateVideographerHourlyInvoice === 'true') {
            hourlyInvoices.push(shoot.generateHourlyInvoice(shoot.videographer));
          }
          if (shoot.interviewer && generateInterviewerHourlyInvoice === 'true') {
            hourlyInvoices.push(shoot.generateHourlyInvoice(shoot.interviewer));
          }
          hourlyInvoices.forEach(i => i && i.save());
        },
      }];
  },
});

export default ShootReady;
