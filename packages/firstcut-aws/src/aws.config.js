
import AWS from 'aws-sdk';
import Lambda from 'aws-sdk/clients/lambda';

const REGION = Meteor.settings.public.aws.region;

AWS.config.update({ region: REGION });
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: Meteor.settings.public.aws.identityPoolId,
});

const lambda = new Lambda({ region: REGION });

const params = {
  FunctionName: lambda.snippet_creator,
  InvocationType: 'RequestResponse',
  LogType: 'Tail',
  Payload: JSON.stringify({
    result: 'TESTING',
  }),
};

lambda.invoke({}, (err, result) => {
  const error_msg = err || result.Payload.errorMessage;
  if (error_msg) {
    reject(error_msg);
  } else {
    resolve(result);
  }
});
