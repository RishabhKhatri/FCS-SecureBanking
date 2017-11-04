import '../imports/api/collections.js';
import '../imports/api/seeder.js';
import '../imports/api/transactions.js';
import { Email } from 'meteor/email';
import { Meteor } from 'meteor/meteor';

var winston  = require('winston');
require('winston-loggly-bulk');
 
winston.add(winston.transports.Loggly, {
  inputToken: "023aa69c-b649-4f65-a68a-a4c533255503",
  subdomain: "rishabhkhatri",
  tags: ["meteor", "winston"],
  json:true
});

winston.log('info',"Hello World from Meteor!");

Meteor.startup(function() {
	SSL('/home/rishabh/Dev/SecureBanking/server/domain.key','/home/rishabh/Dev/SecureBanking/server/domain.crt', 8000);
    reCAPTCHA.config({
        privatekey: '6Ld7zzYUAAAAAD40wjyg9yNsetpzUqFbUrGH__dW'
    });
    winston.log('info', "Hello World from Node.js!  winston-loggly-bulk-demo has started!");
    process.env.MAIL_URL = "smtps://fcs.secure.bank%40gmail.com:CoolSchoolYo@smtp.gmail.com:465/";
});
