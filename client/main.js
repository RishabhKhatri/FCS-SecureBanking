import '../imports/ui/body.js';

FlashMessages.configure({
	autoHide: true,
	hideDelay: 1000,
	autoScroll: true
});

// BrowserPolicy.content.disallowInlineScripts();

Meteor.startup(function() {
    reCAPTCHA.config({
        publickey: '6Ld7zzYUAAAAAENOVkPxOqqfQYXp1TUGLrbOJV_D'
    });
});
