import '../imports/api/collections.js';
import '../imports/api/seeder.js';
import '../imports/api/transactions.js';
import { Logger } from 'meteor/ostrio:logger';
import { LoggerMongo } from 'meteor/ostrio:loggermongo'

Meteor.startup(function() {
	// SSL('/home/rishabh/Dev/SecureBanking/server/domain.key','/home/rishabh/Dev/SecureBanking/server/domain.crt', 8000);
    reCAPTCHA.config({
        privatekey: '6Ld7zzYUAAAAAD40wjyg9yNsetpzUqFbUrGH__dW'
    });
});
