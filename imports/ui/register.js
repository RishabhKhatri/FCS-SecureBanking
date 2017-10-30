import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

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
		var emailVar = event.target.registerEmail.value;
		var nameVar = event.target.registerName.value;
		var contactVar = event.target.registerContact.value;
		var passVar = event.target.registerPass.value;
		var typeVar = event.target.registerType.value;
		if ((/^[789]\d{9}$/.test(contactVar))) {
			Accounts.createUser({
				email: emailVar,
				password: passVar,
				profile: {
					name: nameVar,
					contact: contactVar,
					email: emailVar,
					balance: 0
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
					FlowRouter.go('/');
				}
			});
		}
		else
		{
			FlashMessages.sendError("Invalid phone number.");
		}
	},
});
