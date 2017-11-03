import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.ManageAccounts.onCreated(function bodyOnCreated() {
	Meteor.subscribe('Users');
});

Template.ManageAccounts.helpers({
	internal_accounts()
	{
		if (Roles.userIsInRole(Meteor.userId(), "admin")) {
			return Meteor.users.find({
				$or: [
					{roles: "regular"},
					{roles: "manager"}
				]
			});
		}
		else
		{
			return null;
		}
	},
	external_accounts()
	{
		if (Roles.userIsInRole(Meteor.userId(), "admin")) {
			return Meteor.users.find({
				$or: [
					{roles: "normal"},
					{roles: "company"}
				]
			});
		}
		else
		{
			return null;
		}
	}
});

Template.Account.helpers({
	readable_date()
	{
		return this.createdAt.toDateString();
	},
	isNormal()
	{
		return Roles.userIsInRole(this._id, "normal");
	},
	isCompany()
	{
		return Roles.userIsInRole(this._id, "company");
	},
	isRegular()
	{
		return Roles.userIsInRole(this._id, "regular");
	},
	isManager()
	{
		return Roles.userIsInRole(this._id, "manager");
	}
});

Template.Account.events({
	'click .remove'(event)
	{
		Meteor.call('client.remove', this._id, function(err) {
			if (err) {
				FlashMessages.sendError(err);
				Router.go('homeRoute');	
			}
			else
			{
				FlashMessages.sendSuccess("User deleted successfully!");
				Router.go('manageRoute');
			}
		})
	}
});
