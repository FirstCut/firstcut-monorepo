
import Models from 'firstcut-models';
import { _ } from 'lodash';

const {
  Shoot,
  Invoice,
} = Models;

const shootId = '2322';
const shoots = [{ _id: shootId, projectId: 'projectId' }];

const invoices = [
  {
    _id: '1',
    gigId: shootId,
    type: 'SHOOT',
    payeeId: '1',
  },
  {
    _id: '2',
    gigId: shootId,
    type: 'SHOOT',
    note: 'Booking fee',
    payeeId: '2',
  },
  {
    _id: '3',
    gigId: shootId,
    type: 'SHOOT',
    note: 'booking fee',
    payeeId: '3',
  },
];

describe('shoot model', () => {
  before(() => {
    invoices.forEach(i => Invoice.createNew(i).save());
    shoots.forEach(s => Shoot.createNew(s).save());
  });
  describe('schema', () => {
    it('should be able to set the blueprint', () => {
      let shoot = Shoot.createNew({});
      const blueprint = 'CORPORATE_INTERVIEWS';
      shoot = shoot.set('blueprint', blueprint);
      expect(shoot.blueprint).to.equal(blueprint);
    });

    it('should be able to find its booking fee invoice', () => {
      const shoot = Shoot.findOne({ _id: shootId });
      const bookingInvoices = shoot.getBookingFeeInvoices().toArray();
      expect(shoot.invoices.toArray()).to.have.length(invoices.length);
      expect(bookingInvoices).to.have.length(2);
      expect(bookingInvoices[0].payeeId).to.equal(invoices[1].payeeId);
      expect(bookingInvoices[1].payeeId).to.equal(invoices[2].payeeId);
    });
  });
});
