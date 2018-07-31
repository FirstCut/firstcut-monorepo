import '/imports/startup/both';
import {Models} from 'firstcut-models';
import {getUserEmails, getPlayerFromEmails} from 'firstcut-utils';
import {initFirstcutAWS} from 'firstcut-aws';
import {initPublications} from './publications.js';
import {HTTP} from 'meteor/http';

Meteor.startup(() => {

  initPublications(Models);

  initFirstcutAWS({
    secretAccessKey: Meteor.settings.s3.secret,
    accessKeyId: Meteor.settings.s3.key,
    region: Meteor.settings.s3.region,
    computeSignatureEndpoint: process.env.ROOT_URL + '/computeSignature'
  });

  ServiceConfiguration.configurations.upsert({
    service: 'google'
  }, {
    $set: {
      loginStyle: "popup",
      clientId: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_CLIENT_SECRET
    }
  });

  HTTP.methods({
    'computeSignature': function(data) {
      const date = this.query.datetime.substr(0, 8);
      const stringToSign = this.query.to_sign;
      const kDate = hmac('AWS4' + Meteor.settings.s3.secret, date);
      const kRegion = hmac(kDate, Meteor.settings.public.s3.region);
      const kService = hmac(kRegion, 's3');
      const kSigning = hmac(kService, 'aws4_request');
      const signature = hmac(kSigning, stringToSign);
      return signature.toString();
    }
  });
});

Accounts.onCreateUser(function(options, user) {
  //if they logged in with google, use their email address to find either a collaborator or a client
  let profile = {};
  const emails = getUserEmails(user);
  //look for collaborators and clients with that email address
  const player = getPlayerFromEmails(Models, emails);
  if (player) {
    profile = {
      playerId: player._id
    };
  }
  user.profile = profile;
  return user;
});
