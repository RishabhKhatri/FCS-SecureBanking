import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.Requests.helpers({
	requests()
	{
		return Meteor.users.find({ verified: { $ne: false } }, {sort: { createdAt: -1 } });
	},
});

Template.Request.helpers({
	readable_date()
	{
		return this.createdAt.toDateString();
	},
});
