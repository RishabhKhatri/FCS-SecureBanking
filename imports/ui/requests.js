import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.Requests.onCreated(function bodyOnCreated() {
	Meteor.subscribe('Users');
});

Template.Requests.helpers({
	new_requests()
	{
		if (Roles.userIsInRole(Meteor.userId(), "admin")) {
			return Meteor.users.find({
				$and: [
					{
						$or: [
							{roles: "normal"},
							{roles: "company"},
							{roles: "regular"},
							{roles: "manager"}
						]
					},
					{"profile.verified": {$eq: false}}
				]
			}, { sort: { createdAt: -1 } });
		}
		else
		{
			return null;
		}
	},
	new_requestsCount()
	{
		if (Roles.userIsInRole(Meteor.userId(), "admin")) {
			return Meteor.users.find({
				$and: [
					{
						$or: [
							{roles: "normal"},
							{roles: "company"},
							{roles: "regular"},
							{roles: "manager"}
						]
					},
					{"profile.verified": {$eq: false}}
				]
			}, { sort: { createdAt: -1 } }).count()==0;
		}
		else
		{
			return true;
		}
	},
	edit_requests()
	{
		if (Roles.userIsInRole(Meteor.userId(), "admin")) {
			return Meteor.users.find({
				$and: [
					{
						$or: [
							{roles: "normal"},
							{roles: "company"},
							{roles: "regular"},
							{roles: "manager"}
						]
					},
					{"profile.request_sent": {$eq: true}}
				]
			}, { sort: { createdAt: -1 } });
		}
		else if (Roles.userIsInRole(Meteor.userId(), "regular"))
		{
			return Meteor.users.find({
				$and: [
					{
						$or: [
							{roles: "normal"},
							{roles: "company"}
						]
					},
					{"profile.request_sent": {$eq: true}}
				]
			}, { sort: { createdAt: -1 } });
		}
		else
		{
			return null;
		}
	},
	edit_requestsCount()
	{
		if (Roles.userIsInRole(Meteor.userId(), "admin")) {
			return Meteor.users.find({
				$and: [
					{
						$or: [
							{roles: "normal"},
							{roles: "company"},
							{roles: "regular"},
							{roles: "manager"}
						]
					},
					{"profile.request_sent": {$eq: true}}
				]
			}, { sort: { createdAt: -1 } }).count()==0;
		}
		else if (Roles.userIsInRole(Meteor.userId(), "regular"))
		{
			return Meteor.users.find({
				$and: [
					{
						$or: [
							{roles: "normal"},
							{roles: "company"}
						]
					},
					{"profile.request_sent": {$eq: true}}
				]
			}, { sort: { createdAt: -1 } }).count()==0;
		}
		else
		{
			return true;
		}
	}
});

Template.NewRequest.helpers({
	readable_date()
	{
		return this.createdAt.toDateString();
	},
});

Template.NewRequest.events({
	'click .accept'()
	{
		Meteor.call('client.verify', this._id, function(err, result) {
			if (result) {
				Router.go("requestsRoute");
				FlashMessages.sendSuccess("Successfully verified.");
			}
			else {
				Router.go("homeRoute");
			}
		});
	},
	'click .reject'()
	{
		Meteor.call('client.remove', this._id, function(err, result) {
			if (result) {
				Router.go("requestsRoute");
				FlashMessages.sendSuccess("Successfully rejected.");
			}
			else {
				Router.go("homeRoute");
			}
		});
	}
});

Template.EditRequest.helpers({
	readable_date()
	{
		return this.createdAt.toDateString();
	},
});

Template.EditRequest.events({
	'click .accept'()
	{
		Meteor.call('client.accept_request', this._id, function(err) {
			if (err) {
				FlashMessages.sendError(err);
				Router.go("homeRoute");
			}
			else {
				Router.go("requestsRoute");
				FlashMessages.sendSuccess("Successfully accepted.");
			}
		});
	},
	'click .reject'()
	{
		Meteor.call('client.reject_request', this._id, function(err) {
			if (err) {
				FlashMessages.sendError(err);
				Router.go("homeRoute");
			}
			else {
				Router.go("requestsRoute");
				FlashMessages.sendSuccess("Successfully rejected.");
			}
		});
	}
});

