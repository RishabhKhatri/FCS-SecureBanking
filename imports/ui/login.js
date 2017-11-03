import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import './login.html';

Template.Login.onRendered(function()
{
	$('.login-form').validate({
		rules: {
			loginEmail: {
				required: true,
				email: true
			},
			loginPass: {
				required: true,
				minlength: 6,
			}
		}
	});
});

Template.Login.events({
	'submit form'(event)
	{
		event.preventDefault();
		var emailVar = UniHTML.purify(event.target.loginEmail.value);
		var passVar = UniHTML.purify(event.target.loginPass.value);
		var captchaData = grecaptcha.getResponse();
		Meteor.call('client.check_captcha', captchaData, function(err, result) {
			grecaptcha.reset();
			if (result) {
				Meteor.loginWithPassword(emailVar, passVar, function(error) {
					if (error) {
						FlashMessages.sendError(error.reason);
					}
					else
					{
						Router.go("homeRoute");
					}
				});
			}
			else
			{
				FlashMessages.sendError("Captch Error");
				Router.go("homeRoute");
			}
		});
	}
});
