
import sinon from 'sinon';
import Models from 'firstcut-models';
import { Map } from 'immutable';
import { _ } from 'lodash';
import ChargeClient from '../charge-client';
import { getValidator } from './action-test.utils';
import { ACTIONS } from 'firstcut-pipeline-consts';

const sandbox = sinon.createSandbox({});
const { Invoice } = Models;

const internalInvoice = new Models.Invoice({
  payeeId: 'PAYEE_ID',
  amount: 100,
  gigId: 'GIG_ID',
  status: 'NOT_DUE',
});

const clientInvoice = new Models.Invoice({
  payerId: 'PAYER_ID',
  amount: 300,
  gigId: 'GIG_ID',
  status: 'DUE',
});

const sampleGig = new Models.Project({
  _id: 'GIG_ID',
});

const sampleClient = new Models.Invoice({
  _id: 'PAYER_ID',
  firstName: 'FirstName',
  lastName: 'lastName',
  email: 'client@email.com',
});

// should I just test that the event template is correctly structured,
// and then test the execution of templates separately?
// I don't necessarily need to test the execution of this template directly
// if I can verify that given a correctly structured template,
// the executor can execute it correctly.... right?

// I guess the thing with tests is they can feel very hard-coded............

// how much should I test details like the substitution data? should I make
// sure all the values are the correct value? Is that worth it?
// like should I test to make sure that the email template is correct?
// ugh that feels so hardcoded but it's also an important constant


// substitution_data for example, probably falls under a complex integration test....
// to fully automate validation you would have to scrape the recieved email?

describe.only('Charge client event template', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('should be an immutable map', () => {
    expect(Map.isMap(ChargeClient)).to.be.true;
  });

  it('should have key charge_client', () => {
    expect(ChargeClient.get('key')).to.equal('charge_client');
  });

  it('should pass prerequisites only when the invoice is a client bill', () => {
    const fulfillsPrerequisites = ChargeClient.get('fulfillsPrerequisites');
    // const getInvoiceStub = sandbox.stub(Invoice, 'fromId').get(() => clientBill);
    expect(fulfillsPrerequisites({ record: clientInvoice })).to.equal(true);
    expect(fulfillsPrerequisites({ record: internalInvoice })).to.equal(false);
  });

  it('should include a slack notification, email, and charge invoice', () => {
    sandbox.replace(Invoice, 'fromId', () => clientInvoice);
    sandbox.replace(clientInvoice, 'getClientPayer', () => sampleClient);
    const getAdminOwnerStub = sandbox.stub(clientInvoice, 'gig').get(() => sampleGig);
    const actions = ChargeClient.get('generateActions')({
      record_id: 'PAYER_ID',
      token: 'fake_token',
      initiator_player_id: 'fake_player_id',
    });

    const actionKeys = _.map(actions, a => a.type);
    expect(actionKeys).to.have.members([
      ACTIONS.slack_notify,
      ACTIONS.charge_invoice,
      ACTIONS.send_email,
    ]);
  });

  it('should have all correctly formatted actions', () => {
    sandbox.replace(Invoice, 'fromId', () => clientInvoice);
    sandbox.replace(clientInvoice, 'getClientPayer', () => sampleClient);
    sandbox.stub(clientInvoice, 'gig').get(() => sampleGig);
    const actions = ChargeClient.get('generateActions')({
      record_id: 'PAYER_ID',
      token: 'fake_token',
      initiator_player_id: 'fake_player_id',
    });

    _.forEach(actions, (action) => {
      const validate = getValidator(action);
      validate(action);
    });
  });

  // Is this test unnecessary given the above test?

  // it('should have a charge invoice action with the provided token and invoice', () => {
  //   sandbox.replace(Invoice, 'fromId', () => clientInvoice);
  //   sandbox.replace(clientInvoice, 'getClientPayer', () => sampleClient);
  //   sandbox.stub(clientInvoice, 'gig').get(() => sampleGig);
  //   const token = 'fake_toke';
  //   const actions = ChargeClient.get('generateActions')({
  //     record_id: 'PAYER_ID',
  //     token,
  //     initiator_player_id: 'fake_player_id',
  //   });
  //
  //   const chargeInvoiceActions = _.filter(actions, a => a.type === ACTIONS.charge_invoice);
  //   expect(chargeInvoiceActions).have.lengthOf(1);
  //   const action = chargeInvoiceActions[0];
  //   expect(action.invoice).to.deep.equal(clientInvoice);
  //   expect(action.token).to.equal(token);
  // });
});
