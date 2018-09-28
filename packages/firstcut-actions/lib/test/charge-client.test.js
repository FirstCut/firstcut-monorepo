"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _sinon = _interopRequireDefault(require("sinon"));

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _immutable = require("immutable");

var _lodash = require("lodash");

var _chargeClient = _interopRequireDefault(require("../charge-client"));

var _actionTest = require("./action-test.utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var sandbox = _sinon.default.createSandbox({});

var Invoice = _firstcutModels.default.Invoice;
var internalInvoice = new _firstcutModels.default.Invoice({
  payeeId: 'PAYEE_ID',
  amount: 100,
  gigId: 'GIG_ID',
  status: 'NOT_DUE'
});
var clientInvoice = new _firstcutModels.default.Invoice({
  payerId: 'PAYER_ID',
  amount: 300,
  gigId: 'GIG_ID',
  status: 'DUE'
});
var sampleGig = new _firstcutModels.default.Project({
  _id: 'GIG_ID'
});
var sampleClient = new _firstcutModels.default.Invoice({
  _id: 'PAYER_ID',
  firstName: 'FirstName',
  lastName: 'lastName',
  email: 'client@email.com'
}); // should I just test that the event template is correctly structured,
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

describe.only('Charge client event template', function () {
  afterEach(function () {
    sandbox.restore();
  });
  it('should be an immutable map', function () {
    expect(_immutable.Map.isMap(_chargeClient.default)).to.be.true;
  });
  it('should have key charge_client', function () {
    expect(_chargeClient.default.get('key')).to.equal('charge_client');
  });
  it('should pass prerequisites only when the invoice is a client bill', function () {
    var fulfillsPrerequisites = _chargeClient.default.get('fulfillsPrerequisites'); // const getInvoiceStub = sandbox.stub(Invoice, 'fromId').get(() => clientBill);


    expect(fulfillsPrerequisites({
      record: clientInvoice
    })).to.equal(true);
    expect(fulfillsPrerequisites({
      record: internalInvoice
    })).to.equal(false);
  });
  it('should include a slack notification, email, and charge invoice', function () {
    sandbox.replace(Invoice, 'fromId', function () {
      return clientInvoice;
    });
    sandbox.replace(clientInvoice, 'getClientPayer', function () {
      return sampleClient;
    });
    var getAdminOwnerStub = sandbox.stub(clientInvoice, 'gig').get(function () {
      return sampleGig;
    });

    var actions = _chargeClient.default.get('generateActions')({
      record_id: 'PAYER_ID',
      token: 'fake_token',
      initiator_player_id: 'fake_player_id'
    });

    var actionKeys = _lodash._.map(actions, function (a) {
      return a.type;
    });

    expect(actionKeys).to.have.members([_firstcutPipelineConsts.ACTIONS.slack_notify, _firstcutPipelineConsts.ACTIONS.charge_invoice, _firstcutPipelineConsts.ACTIONS.send_email]);
  });
  it('should have all correctly formatted actions', function () {
    sandbox.replace(Invoice, 'fromId', function () {
      return clientInvoice;
    });
    sandbox.replace(clientInvoice, 'getClientPayer', function () {
      return sampleClient;
    });
    sandbox.stub(clientInvoice, 'gig').get(function () {
      return sampleGig;
    });

    var actions = _chargeClient.default.get('generateActions')({
      record_id: 'PAYER_ID',
      token: 'fake_token',
      initiator_player_id: 'fake_player_id'
    });

    _lodash._.forEach(actions, function (action) {
      var validate = (0, _actionTest.getValidator)(action);
      validate(action);
    });
  }); // Is this test unnecessary given the above test?
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