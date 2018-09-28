Package.describe({
  name: 'percolate:google-api',
  summary: "A Meteor library to interact with Google's API",
  version: '1.0.5',
  git: 'https://github.com/percolatestudio/meteor-google-api'
});

Package.on_use(function (api, where) {
  if (api.versionsFrom) {
    api.versionsFrom('0.9.0');
    api.use(['http', 'livedata', 'google-oauth@1.2.0', 'mrt:q@1.0.1', 'accounts-base', 'underscore']);
  } else {
    api.use(['http', 'livedata', 'google-oauth@1.2.0', 'q', 'accounts-base', 'underscore']);
  }

  api.add_files(['utils', 'google-api-async'], ['client', 'server']);
  api.add_files(['google-api-methods'], ['server']);

  api.export('GoogleApi', ['client', 'server']);
});

Package.on_test(function (api) {
  api.use([
    'percolate:google-api',
    'tinytest',
    'http',
    'accounts-base',
    'service-configuration',
    'underscore']);

  api.add_files('google-api-tests', ['client', 'server']);
});
