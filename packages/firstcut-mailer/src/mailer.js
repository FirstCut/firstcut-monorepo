
import SparkPost from 'sparkpost';
import SimpleSchema from 'simpl-schema';

const FROM_DOMAIN = 'email@firstcut.io';

const API_KEY = Meteor.settings.email.api_key;

class Mailer {
  constructor() {
    this.client = new SparkPost(API_KEY);
  }

  send({template, addresses, substitution_data={}}) {
    new SimpleSchema({
      addresses: Array,
      'addresses.$': {
        type: String,
        regEx: SimpleSchema.RegEx.Email
      }
    }).validate({addresses});
    const recipients = addresses.map(to => {return {address: to}});
    return this._send({
        content: {
          from: FROM_DOMAIN,
          template_id: template,
        },
        substitution_data,
        recipients: recipients
      });
  }

  _send(content) {
    return this.client.transmissions.send(content)
  }
}

export default Mailer;
