import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { Transactions } from '../api/transactions.js';

Template.History.onCreated(function bodyOnCreated() {
	Meteor.subscribe('transactions');
});

Template.History.helpers({
	transactions()
	{
		return Transactions.find({}, { sort: { createdAt: -1 } });
	},
});

Template.Transaction.helpers({
	readable_date()
	{
		return this.createdAt.toDateString();
	},
});
