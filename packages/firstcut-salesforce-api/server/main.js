
import { _ } from 'lodash';

const parser = require('xml2json');
const prettyjson = require('prettyjson');
const sf = require('jsforce');

Meteor.startup(() => {
  HTTP.methods({
    salesforceOutboundMessage(data) {
      console.log('MSGGGG');
      const xml = data.toString('utf8');
      const json = JSON.parse(parser.toJson(xml));
      const { notifications } = json['soapenv:Envelope']['soapenv:Body'];
      console.log(notifications);
      const sessionId = notifications.SessionId;
      const serverUrl = notifications.EnterpriseUrl;
      console.log(sessionId);
      console.log(serverUrl);
      const conn = new sf.Connection({
        serverUrl,
        sessionId,
      });

      const obj = notifications.Notification.sObject;
      const proj = {};
      proj.name = obj['sf:Name'];
      proj.amount = obj['sf:Amount'];
      proj.notes = obj['sf:Description'];
      proj.adminOwnerId = obj['sf:producer__c'];
      console.log(obj);
      const accountId = obj['sf:AccountId'];

      const companyInfo = getCompanyInfo(accountId, conn);
      const company = {};
      company.name = companyInfo.Name;
      company.companyId = companyInfo.Id;
      company.website = companyInfo.website;
      company.location = salesforceAddressToLocation(companyInfo.address);

      const relatedContacts = getRelatedContacts(accountId, conn);
      const clients = [];
      _.forEach(relatedContacts, (contact) => {
        const client = {};
        client.firstName = relatedContacts.FirstName;
        client.lastName = relatedContacts.LastName;
        client.phone = relatedContacts.phone;
        client.email = relatedContacts.email;
        client.location = salesforceAddressToLocation(relatedContacts.address);

        clients.push(client);
      });
      // console.log(JSON.parse(data.toString()));
      // console.log(JSON.stringify(data).data);
      // console.log(JSON.stringify(data.data).data);
      return '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:out="http://soap.sforce.com/2005/09/outbound"><soapenv:Header/><soapenv:Body><out:notificationsResponse><out:Ack>true</out:Ack></out:notificationsResponse></soapenv:Body></soapenv:Envelope>';
    },
  });
});

function getCompanyInfo(accountId, conn) {
  console.log('the accountId');
  console.log(accountId);
  conn.query(`SELECT Id, Name FROM Account WHERE Status = ${accountId}`, (err, result) => {
    if (err) { return console.error(err); }
    console.log(`total : ${result.totalSize}`);
    console.log(`fetched : ${result.records.length}`);
  });

  const records = [];
  conn.query('SELECT Id, Name FROM Account')
    .on('record', (record) => {
      console.log('RECORD event');
      console.log(record);
      records.push(record);
    })
    .on('end', (query) => {
      console.log(`total in database : ${query.totalSize}`);
      console.log(`total fetched : ${query.totalFetched}`);
    })
    .on('error', (err) => {
      console.error(err);
    })
    .run({ autoFetch: true, maxFetch: 4000 });
  return {};
}

function getRelatedContacts(accountId, conn) {
  return {};
}
