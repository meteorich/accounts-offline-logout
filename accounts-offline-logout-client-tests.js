// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by accounts-offline-logout.js.
import { name as packageName } from "meteor/meteorich:accounts-offline-logout";

// Write your tests here!
// Here is an example.
Tinytest.add('accounts-offline-logout - example', function (test) {
  test.equal(packageName, "accounts-offline-logout");
});
