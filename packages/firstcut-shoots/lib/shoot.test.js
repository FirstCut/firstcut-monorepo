"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _lodash = require("lodash");

var Shoot = _firstcutModels.default.Shoot,
    Invoice = _firstcutModels.default.Invoice;
var shootId = '2322';
var shoots = [{
  _id: shootId,
  projectId: 'projectId'
}];
var invoices = [{
  _id: '1',
  gigId: shootId,
  type: 'SHOOT',
  payeeId: '1'
}, {
  _id: '2',
  gigId: shootId,
  type: 'SHOOT',
  note: 'Booking fee',
  payeeId: '2'
}, {
  _id: '3',
  gigId: shootId,
  type: 'SHOOT',
  note: 'booking fee',
  payeeId: '3'
}];
describe('shoot model', function () {
  before(function () {
    invoices.forEach(function (i) {
      return Invoice.createNew(i).save();
    });
    shoots.forEach(function (s) {
      return Shoot.createNew(s).save();
    });
  });
  describe('schema', function () {
    it('should be able to set the blueprint', function () {
      var shoot = Shoot.createNew({});
      var blueprint = 'CORPORATE_INTERVIEWS';
      shoot = shoot.set('blueprint', blueprint);
      expect(shoot.blueprint).to.equal(blueprint);
    });
    it('should be able to find its booking fee invoice', function () {
      var shoot = Shoot.findOne({
        _id: shootId
      });
      var bookingInvoices = shoot.getBookingFeeInvoices().toArray();
      expect(shoot.invoices.toArray()).to.have.length(invoices.length);
      expect(bookingInvoices).to.have.length(2);
      expect(bookingInvoices[0].payeeId).to.equal(invoices[1].payeeId);
      expect(bookingInvoices[1].payeeId).to.equal(invoices[2].payeeId);
    });
  });
});