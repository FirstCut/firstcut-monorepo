
import { ACTIONS } from 'firstcut-pipeline-consts';
import { _ } from 'lodash';
import { Map } from 'immutable';

export function getValidator(action) {
  switch (action.type) {
    case ACTIONS.slack_notify:
      return ActionValidators.get('validateSlackNotificationAction');
    case ACTIONS.text_message:
      return ActionValidators.get('validateTextMessageAction');
    case ACTIONS.charge_invoice:
      return ActionValidators.get('validateChargeAction');
    case ACTIONS.calendar_event:
      return ActionValidators.get('validateCalendarAction');
    case ACTIONS.custom_function:
      return ActionValidators.get('validateCustomFunctionAction');
    case ACTIONS.send_email:
      return ActionValidators.get('validateEmailAction');
    default:
      throw new Error('unsupported action');
  }
}

const ActionValidators = new Map({
  validateChargeAction(action) {
    const keys = _.keys(action);
    expect(keys).to.have.members(['type', 'invoice', 'token']);
    expect(action.invoice).to.not.be.null;
    expect(action.token).to.be.a('string');
    expect(action.invoice.modelName).to.not.be.null;
    expect(action.invoice.modelName).to.equal('Invoice');
  },

  validateTextMessageAction(action) {
    throw new Error('unimplemented validator');
  },

  validateCalendarAction(action) {
    throw new Error('unimplemented validator');
  },

  validateEmailAction(action) {
    const keys = Object.keys(action);
    expect(keys).to.have.members(['type', 'to', 'substitution_data', 'template', 'cc']);
    expect(action.to).to.be.an('array');
    expect(action.to).to.not.have.lengthOf(0);
    _.forEach(action.to, to => expect(to).to.be.a('string'));
    expect(action.substitution_data).to.be.a('object');
    expect(action.template).to.be.a('string');
    expect(action.cc).to.be.a('array');
    _.forEach(action.cc, cc => expect(cc).to.be.a('string'));
  },

  validateCustomFunctionAction(action) {
    throw new Error('unimplemented validator');
  },

  validateSlackNotificationAction(action) {
    const keys = Object.keys(action);
    expect(keys).to.have.members(['type', 'content']);
    expect(action.content).to.be.an('object');
  },
});

export default ActionValidators;
