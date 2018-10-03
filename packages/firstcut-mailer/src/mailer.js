
import SparkPost from 'sparkpost';

const FROM_DOMAIN = 'email@firstcut.io';

const API_KEY = Meteor.settings.email.api_key;

class Mailer {
  constructor() {
    this.client = new SparkPost(API_KEY);
  }

  send({
    template, to, cc = [], substitution_data = {},
  }) {
    const recipients = to.map(email => ({ address: { email } }));
    const ccRecipients = cc.map(email => ({ address: { email, header_to: to[0] } }));
    const content = {
      from: FROM_DOMAIN,
      template_id: template,
    };
    if (cc.length > 0) {
      const headerCC = cc.join(',');
      content.headers = { CC: headerCC };
    }
    return this._send({
      content,
      substitution_data,
      recipients: [...recipients, ...ccRecipients],
    });
  }

  _send(content) {
    return this.client.transmissions.send(content);
  }
}

export default Mailer;
