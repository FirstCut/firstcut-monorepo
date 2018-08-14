
import { _ } from 'lodash';
import { Random } from 'meteor/random';

const parser = require('xml2json');
const prettyjson = require('prettyjson');
const sf = require('jsforce');

Meteor.startup(() => {
  HTTP.methods({
    async salesforceOutboundMessage(data) {
      const xml = data.toString('utf8');
      const json = JSON.parse(parser.toJson(xml));
      const { notifications } = json['soapenv:Envelope']['soapenv:Body'];
      const obj = notifications.Notification.sObject;

      const accountId = obj['sf:AccountId'];
      const producerEmail = getProducerEmail(obj['sf:Producer__c']);
      const project = {};
      const company = {};
      let clients = [];

      project.name = obj['sf:Name'];
      project.invoiceAmount = obj['sf:Amount'];
      project.notes = obj['sf:Description'];

      const sessionId = notifications.SessionId;
      const serverUrl = notifications.EnterpriseUrl;
      const conn = new sf.Connection({
        serverUrl,
        sessionId,
      });
      getCompanyInfo(accountId, conn)
        .then((companyInfo) => {
          company.name = companyInfo.Name;
          company.website = companyInfo.Website;
          company.location = salesforceAddressToLocation(companyInfo.BillingAddress);

          return getRelatedContacts(accountId, conn);
        })
        .then((relatedContacts) => {
          clients = relatedContacts.map((contact) => {
            const { first, last } = splitFullName(contact.Name);
            return {
              companyId: company._id,
              firstName: first,
              lastName: last,
              phone: contact.Phone,
              email: contact.Email,
            };
          });
        })
        .then(() => {
          console.log(clients);
          projectHandoff({
            project, company, clients, producerEmail,
          });
        })
        .catch((err) => {
          console.log('ERROR CAUGHT');
          console.log(err);
        });

      return '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:out="http://soap.sforce.com/2005/09/outbound"><soapenv:Header/><soapenv:Body><out:notificationsResponse><out:Ack>true</out:Ack></out:notificationsResponse></soapenv:Body></soapenv:Envelope>';
    },
  });
});

function getProducerEmail(fullname) {
  switch (fullname) {
    case 'Alex Lim':
      return 'alex@firstcut.io';
    case 'Rebecca Jackson':
      return 'rebecca@firstcut.io';
    case 'Tomas De Matteis':
      return 'tomas@firstcut.io';
    case 'Shaun Mcreedy':
      return 'shaun@firstcut.io';
      break;
    default:
  }
}
function projectHandoff({
  project, company, clients, producerEmail,
}) {
  const { firstcutDataServerUrl } = Meteor.settings;
  HTTP.call('GET', `${firstcutDataServerUrl}/projectHandoff`, {
    params: {
      company, clients: JSON.stringify(clients), project, producerEmail,
    },
  }, (err, res) => {
    if (err) {
      console.log('ERRrrrrrr posting');
      console.log('posting THIS');
      console.log(err);
    }
  });
}

function salesforceAddressToLocation(addr) {
  const {
    city, country, latitude, longitude, postalCode, street,
  } = addr;
  return {
    locality: city,
    country,
    street_address: street,
  };
}

function splitFullName(name) {
  const names = name.split(' ');
  const first = names[0];
  const rest = _.slice(names, 1);
  const last = _.join(rest, ' ');
  return { first, last };
}

function getCompanyInfo(accountId, conn) {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT Id, Name, BillingAddress, Website FROM Account WHERE Id = '${accountId}'`)
      .on('record', (record) => {
        resolve(record);
      })
      .on('end', () => {
        console.log('all records retrieved');
      })
      .on('error', (err) => {
        reject(err);
      })
      .run({ autoFetch: true, maxFetch: 4000 });
  });
}

function getRelatedContacts(accountId, conn) {
  return new Promise((resolve, reject) => {
    const records = [];
    conn.query(`SELECT Id, Email, Phone, Name FROM Contact WHERE AccountId = '${accountId}'`)
      .on('record', (record) => {
        records.push(record);
      })
      .on('end', () => {
        console.log('all records retrieved');
        resolve(records);
      })
      .on('error', (err) => {
        console.error(err);
        reject(err);
      })
      .run({ autoFetch: true, maxFetch: 4000 });
  });
}
