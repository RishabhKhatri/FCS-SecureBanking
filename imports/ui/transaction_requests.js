import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { Transactions } from '../api/transactions.js';

Template.TransRequests.onCreated(function bodyOnCreated() {
	Meteor.subscribe('transactions');
});

Template.TransRequests.helpers({
	requests()
	{
		return Transactions.find({verified: {$eq: false}}, { sort: { createdAt: -1 } });
	},
	requestCount()
	{
		return Transactions.find({verified: {$eq: false}}, { sort: { createdAt: -1 } }).count()==0;	
	}
});

Template.TransRequest.helpers({
	readable_date()
	{
		return this.createdAt.toDateString();
	},
});

Template.TransRequest.events({
	'click .accept'()
	{
		Meteor.call('transactions.insert', this._id, this.from, this.to, this.amount, this.type, function(err, result)
		{
			if (err) {
				FlashMessages.sendError(err);
				Router.go("homeRoute");
			}
			else
			{
				FlashMessages.sendSuccess("Approved successfully");
				Router.go("transRequestRoute");
			}
		});
	},
	'click .reject'()
	{
		Meteor.call('transactions.reject', this._id, function(err, result)
		{
			if (err) {
				FlashMessages.sendError(err);
				Router.go("homeRoute");
			}
			else
			{
				FlashMessages.sendSuccess("Approved successfully");
				Router.go("transRequestRoute");
			}
		});
	}
});
