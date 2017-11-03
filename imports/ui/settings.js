import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import '../api/collections.js';
import './settings.html';

Template.Settings.onRendered(function() {
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
			newPass: {
				minlength: 6,
			},
			currentPass: {
				required: true,
				minlength: 6,
			}
		}
	});
});

Template.Settings.helpers({
	isChange()
	{
		return Meteor.user().profile.change_request;
	},
	isRequest()
	{
		return Meteor.user().profile.request_sent;
	},
	form_data()
	{
		return Meteor.user();
	}
});

Template.Settings.events({
	'click .request'(event)
	{
		Meteor.call('client.request', function(err) {
			if (err) {
				FlashMessages.sendError(err);
			}
			else {
				FlashMessages.sendSuccess("Request sent.");
				Router.go('settingsRoute');
			}
		})
	},
	'submit form'(event)
	{
		event.preventDefault();
		var nameVar = UniHTML.purify(event.target.registerName.value);
		var contactVar = UniHTML.purify(event.target.registerContact.value);
		var newVar = UniHTML.purify(event.target.newPass.value);
		var currentVar = UniHTML.purify(event.target.currentPass.value);
		if (newVar!="") {
			Accounts.changePassword(currentVar, newVar, function(err) {
				if (err) {
					FlashMessages.sendError(err);
					Router.go("homeRoute");
				}
				else
				{
					if ((/^[789]\d{9}$/.test(contactVar))) {
						Meteor.call('client.update', nameVar, contactVar, function(err) {
							if (err) {
								FlashMessages.sendError(err);
								Router.go("homeRoute");
							}
							else
							{
								FlashMessages.sendSuccess("Account updated successfully!");
								Router.go("homeRoute");
							}
						});
					}
					else
					{
						FlashMessages.sendError("Invalid phone number.");
					}
				}
			});
		}
		else
		{
			currentVar = Package.sha.SHA256(currentVar);
			Meteor.call('transactions.check_pass', currentVar, function(err, result) {
				if (result) {
					if ((/^[789]\d{9}$/.test(contactVar))) {
						Meteor.call('client.update', nameVar, contactVar, function(err) {
							if (err) {
								FlashMessages.sendError(err);
								Router.go("homeRoute");
							}
							else
							{
								FlashMessages.sendSuccess("Account updated successfully!");
								Router.go("homeRoute");
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
					Router.go('homeRoute');
					FlashMessages.sendError("Incorrect Password!");
				}
			});
		}
	},
});
