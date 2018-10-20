
import { Map } from 'immutable';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';

const LandingPageSubmit = new Map({
  key: 'landing_page_submit',
  action_title: 'Submit landing page form',
  completed_title: 'Landing page submitted',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(Models, eventData) {
    const {
      first, last, email, company, about, adId,
    } = eventData;
    return [
      {
        type: ACTIONS.slack_notify,
        channel: 'landingpage',
        content: {
          text: `Landing page submit: ${first} ${last} from ${company} submitted a the form for ad ${adId}. Email: ${email}, about: ${about}`,
        },
      }, {
        type: ACTIONS.custom_function,
        execute() {
          const request = Models.LandingPageRequest.createNew(eventData);
          request.save();
        },
      }];
  },
});

export default LandingPageSubmit;
