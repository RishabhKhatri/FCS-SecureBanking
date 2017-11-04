import '../imports/ui/body.js';
import { Meteor } from 'meteor/meteor';

FlashMessages.configure({
	autoHide: true,
	hideDelay: 1000,
	autoScroll: true
});

Meteor.startup(function() {
    reCAPTCHA.config({
        publickey: '6Ld7zzYUAAAAAENOVkPxOqqfQYXp1TUGLrbOJV_D'
    });
});
