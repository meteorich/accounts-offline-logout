Package.describe({
  name: 'meteorich:accounts-offline-logout',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Clears client side user information when logging out with no connection (and also destroys server token when connection is re-established)',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.3');
  api.use('ecmascript');
  api.use('accounts-base');
  api.mainModule('accounts-offline-logout-client.js', 'client');
  api.mainModule('accounts-offline-logout-server.js', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('meteorich:accounts-offline-logout');
  api.mainModule('accounts-offline-logout-client-tests.js', 'client');
});
