import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import '../api/collections.js';
import './add_internal.html';

Template.AddInternal.onRendered(function() {
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

Template.AddInternal.events({
	'submit form'(event)
	{
		event.preventDefault();
		var emailVar = event.target.registerEmail.value;
		var nameVar = event.target.registerName.value;
		var contactVar = event.target.registerContact.value;
		var passVar = event.target.registerPass.value;
		var typeVar = event.target.registerType.value;
		if ((/^[789]\d{9}$/.test(contactVar))) {
			Meteor.call('client.addAccount', emailVar, nameVar, contactVar, passVar, function(err, result)
			{
				if (err) {
					FlashMessages.sendError(err.reason);
					Router.go("homeRoute");
				}
				else
				{
					Meteor.call('client.insertRole', result, typeVar);
					Router.go("homeRoute");
					FlashMessages.sendSuccess("User added successfully");
				}
			});
		}
		else
		{
			FlashMessages.sendError("Invalid phone number.");
		}
	},
});
