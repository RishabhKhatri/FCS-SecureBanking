import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.ManageAccounts.onCreated(function bodyOnCreated() {
	Meteor.subscribe('Users');
});

Template.ManageAccounts.helpers({
	internal_accounts()
	{
		return Meteor.users.find({
			$or: [
				{roles: "regular"},
				{roles: "manager"}
			]
		});
	},
	external_accounts()
	{
		return Meteor.users.find({
			$or: [
				{roles: "normal"},
				{roles: "company"}
			]
		});
	}
});

Template.Account.helpers({
	readable_date()
	{
		return this.createdAt.toDateString();
	},
});
