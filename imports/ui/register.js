import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

import '../api/collections.js';
import './register.html';

Template.Register.onRendered(function() {
	// body...
	$('.register-form').validate({
		rules:
		{
			registerName: {
				maxlength: 20,
				required: true,
			},
			registerEmail: {
				required: true,
				email: true,
			},
			registerContact: {
				required: true,
				minlength: 10,
				maxlength: 10,
				number: true,
			},
			registerPass: {
				required: true,
				minlength: 6,
			}
		}
	});
});

Template.Register.events({
	'submit form'(event)
	{
		event.preventDefault();
		var emailVar = UniHTML.purify(event.target.registerEmail.value);
		var nameVar = UniHTML.purify(event.target.registerName.value);
		var contactVar = UniHTML.purify(event.target.registerContact.value);
		var passVar = UniHTML.purify(event.target.registerPass.value);
		var typeVar = UniHTML.purify(event.target.registerType.value);
		var captchaData = grecaptcha.getResponse();
		Meteor.call('client.check_captcha', captchaData, function(err, result) {
			grecaptcha.reset();
			if (result) {
				if ((/^[789]\d{9}$/.test(contactVar))) {
					Accounts.createUser({
						email: emailVar,
						password: passVar,
						profile: {
							name: nameVar,
							contact: contactVar,
							email: emailVar,
							balance: 0,
							verified: false,
							change_request: false,
							request_sent: false,
						}
					}, function(error) {
						if (error) {
							FlashMessages.sendError(error.reason);
						}
						else
						{
							var userId = Meteor.userId();
							Meteor.call('client.insertRole', userId, typeVar);
							FlashMessages.sendSuccess("Signed up successfully.");
							Router.go('homeRoute');
						}
					});
				}
				else
				{
					FlashMessages.sendError("Invalid phone number.");
				}
			}
			else
			{
				FlashMessages.sendError("Captch Error");
				Router.go("homeRoute");
			}
		})
	},
});
