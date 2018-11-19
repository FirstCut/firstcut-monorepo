
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

Meteor.methods({
  postRequest(data) {
    console.log('data');
    console.log(data);
    HTTP.post(`${Meteor.settings.public.PIPELINE_ROOT}/handleEvent`, {
      content: data, params: data, query: data, data,
    }, (res) => {
      console.log(res);
    });
  },
});
