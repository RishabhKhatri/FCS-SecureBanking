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
		var emailVar = event.target.loginEmail.value;
		var passVar = event.target.loginPass.value;
		Meteor.loginWithPassword(emailVar, passVar, function(error) {
			if (error) {
				FlashMessages.sendError(error.reason);
				console.log(error.reason);
			}
			else
			{
				FlowRouter.go('/');
			}
		});
	},
});