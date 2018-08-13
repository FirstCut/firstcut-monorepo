
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
      const sessionId = notifications.SessionId;
      const serverUrl = notifications.EnterpriseUrl;
      const conn = new sf.Connection({
        serverUrl,
        sessionId,
      });

      const obj = notifications.Notification.sObject;
      const accountId = obj['sf:AccountId'];
      const project = {};
      let company = {};
      let clients = [];
      project._id = Random.id();
      project.name = obj['sf:Name'];
      project.amount = obj['sf:Amount'];
      project.notes = obj['sf:Description'];
      findProducerRecord(obj['sf:Producer__c'])
        .then((producer) => {
          if (producer) {
            project.adminOwnerId = producer._id;
          }
          return getCompanyInfo(accountId, conn);
        })
        .then((companyInfo) => {
          company._id = Random.id();
          company.name = companyInfo.Name;
          company.companyId = companyInfo.Id;
          company.website = companyInfo.Website;
          company.location = salesforceAddressToLocation(companyInfo.BillingAddress);
          project.companyId = company._id;
          return findExistingCompanyRecord(company);
        })
        .then((companyRecord) => {
          if (companyRecord) {
            company = companyRecord;
          } else {
            console.log('NOt sounf');
            // postToFirstcutDatabase(company, 'companies'); // yes this will be posted multiple times potentially
          }
          return getRelatedContacts(accountId, conn);
        })
        .then((relatedContacts) => {
          clients = relatedContacts.map((contact) => {
            const client = {};
            const { first, last } = splitFullName(contact.Name);
            client._id = Random.id();
            client.companyId = company._id;
            client.firstName = first;
            client.lastName = last;
            client.phone = contact.Phone;
            client.email = contact.Email;
            return client;
          // postToFirstcutDatabase(client, 'clients');
          });

          const getClientRecords = clients.map(c => findExistingClientRecord(c));
          return Promise.all(getClientRecords);
        })
        .then((clientRecords) => {
          console.log('CLIENT RECORDS');
          console.log(clientRecords);
          clientRecords.forEach((record, i) => {
            let client = clients[i];
            if (record) {
              client = record;
            }
            project.clientOwnerId = client._id;
          });
          console.log(project);
          console.log(clients);
          console.log(company);
        })
        .then(() => {
          projectHandoff({ project, company, clients });
        })
        .catch((err) => {
          console.log('ERROR CAUGHT');
          console.log(err);
        });

      // console.log(JSON.parse(data.toString()));
      // console.log(JSON.stringify(data).data);
      // console.log(JSON.stringify(data.data).data);
      return '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:out="http://soap.sforce.com/2005/09/outbound"><soapenv:Header/><soapenv:Body><out:notificationsResponse><out:Ack>true</out:Ack></out:notificationsResponse></soapenv:Body></soapenv:Envelope>';
    },
  });
});

function findProducerRecord(producerSalesforceId) {
  if (!producerSalesforceId) {
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }
  const query = { salesforceId: producerSalesforceId };
  return findExistingRecord('Collaborator', query);
}

function findExistingCompanyRecord(company) {
  const query = { name: company.name };
  return findExistingRecord('Company', query);
}

function findExistingClientRecord(client) {
  // const query = JSON.stringify({ email: client.email });
  const query = { email: client.email };
  return findExistingRecord('Client', query);
}

function findExistingRecord(modelName, query) {
  const { firstcutDataServerUrl } = Meteor.settings;
  return new Promise((resolve, reject) => {
    HTTP.call('GET', `${firstcutDataServerUrl}/recordExists`, { params: { modelName, query } }, (err, res) => {
      if (err) {
        reject(err);
      }
      console.log(res.content);
      const content = JSON.parse(res.content);
      resolve(content.record);
    });
  });
}

// function postToFirstcutDatabase(data, modelName) {
//   if (Array.isArray(data)) {
//     _.forEach(data, (record) => {
//       postRecord(record, modelName);
//     });
//   } else {
//     postRecord(data, modelName);
//   }
// }
//
function projectHandoff({
  project, company, clients, producerSalesforceId,
}) {
  const { firstcutDataServerUrl } = Meteor.settings;
  HTTP.call('GET', `${firstcutDataServerUrl}/projectHandoff`, {
    params: {
      company, clients, project, producerSalesforceId,
    },
  }, (err, res) => {
    if (err) {
      console.log('ERRrrrrrr posting');
      console.log('posting THIS');
      console.log(record);
      console.log(collectionName);
    } else {
      console.log('the result');
      console.log(res);
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
