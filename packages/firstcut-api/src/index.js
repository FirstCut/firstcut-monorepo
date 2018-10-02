
import CryptoJS from 'crypto-js';
import { HTTP } from 'firstcut-meteor';
import { PubSub } from 'pubsub-js';
import Models from 'firstcut-models';
import { Random } from 'meteor-random';
import { handleEvent as pipelineExecuteEvent } from 'firstcut-pipeline';

HTTP.methods({
  computeSignature(data) {
    const date = this.query.datetime.substr(0, 8);
    const stringToSign = this.query.to_sign;
    const kDate = hmac(`AWS4${Meteor.settings.s3.secret}`, date);
    const kRegion = hmac(kDate, Meteor.settings.public.s3.region);
    const kService = hmac(kRegion, 's3');
    const kSigning = hmac(kService, 'aws4_request');
    const signature = hmac(kSigning, stringToSign);
    return signature.toString();
  },
  handleEvent(args) {
    const data = this.query;
    return pipelineExecuteEvent(data);
  },
  recordExists(data) {
    const { modelName, query } = this.query;
    const record = Models.getRecordFromQuery(modelName, query);
    return { record };
  },
  projectHandoff() {
    const data = this.query;
    const {
      company, project, producerEmail, primaryContact,
    } = data;
    let { clients } = data;
    try {
      let projectRecord = Models.Project.findOne({ salesforceId: project.salesforceId });
      if (projectRecord) {
        return { error: 'project already exists' };
      }

      clients = JSON.parse(clients);
      const producer = (producerEmail) ? Models.Collaborator.findOne({ email: producerEmail }) : null;
      if (!producer) {
        PubSub.publish('error', { event_data: { message: 'Attempted to execute project handoff, but producer was not defined', data } });
      }

      const bareWebsite = (company.website) ? company.website.replace(/http[s]?:\/\//, '') : '';
      let companyRecord = Models.Company.findOne({ website: { $regex: bareWebsite } });
      if (!companyRecord || !bareWebsite) {
        companyRecord = Models.Company.createNew({ _id: Random.id(), ...company });
      }

      let primaryContactId = null;
      const clientRecords = clients.map((c) => {
        let record = Models.Client.findOne({ email: c.email, companyId: companyRecord._id });
        if (!record) {
          record = Models.Client.createNew({ _id: Random.id(), ...c });
        }
        if (record.email === primaryContact.email) {
          primaryContactId = record._id;
        }
        record = record.set('companyId', companyRecord._id);
        return record;
      });
      console.log('PRIMAR CONTACT ID');
      console.log(primaryContactId);

      projectRecord = Models.Project.createNew({
        _id: Random.id(),
        adminOwnerId: producer._id,
        clientOwnerId: primaryContactId,
        companyId: companyRecord._id,
        ...project,
      });

      companyRecord.save()
        .catch((e) => {
          PubSub.publish('error', { error: e, message: 'Error executing project handoff. Could not save company record', record: company });
        });

      clientRecords.forEach((c) => {
        c.save()
          .catch((e) => {
            PubSub.publish('error', { error: e, message: 'Error executing project handoff. Could not save client record', record: c });
          });
      });

      projectRecord.save()
        .then((record) => {
          PubSub.publish('project_handoff', { record_id: projectRecord._id });
        })
        .catch((e) => {
          PubSub.publish('error', { event_data: { error: e, message: 'Error executing project handoff. Could not save project record', record: project } });
        });
    } catch (e) {
      PubSub.publish('error', { message: 'Could not complete project handoff. Error creating records', error: e, data });
      return { error: e };
    }

    return { result: 'success' };
  },
});

function hmac(key, value) {
  return CryptoJS.HmacSHA256(value, key);
// return AWS.util.crypto.lib.createHmac(value, key);
}
