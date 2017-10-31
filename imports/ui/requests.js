import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.Requests.onCreated(function bodyOnCreated() {
	Meteor.subscribe('Users');
});

Template.Requests.helpers({
	requests()
	{
		return Meteor.users.find({"profile.verified": {$eq: false}}, { sort: { createdAt: -1 } });
	},
	requestsCount()
	{
		return Meteor.users.find({"profile.verified": {$eq: false}}, { sort: { createdAt: -1 } }).count() == 0;	
	}
});

Template.Request.helpers({
	readable_date()
	{
		return this.createdAt.toDateString();
	},
});

Template.Request.events({
	'click .accept'()
	{
		console.log("accepted");
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
		console.log("removed");
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

