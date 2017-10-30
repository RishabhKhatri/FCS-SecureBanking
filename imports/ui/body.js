import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { Transactions } from '../api/transactions.js';

import '../api/collections.js';
import './body.html';
import './register.html';
import './login.html';
import './get_started.html';
import './home.html';
import './register.js';
import './login.js';
import './profile.html';
import './sidebar.html';
import './newTransaction.html';
import './newTransaction.js';
import './history.html';
import './history.js';

Template.body.onCreated(function bodyOnCreated() {
	// body...
	Meteor.subscribe('transactions');
});

Template.body.helpers({
	transactions()
	{
		return Transactions.find({}, { sort: { createdAt: -1 } });
	},
	istype(type)
	{
		return this.type == type;
	},
});

Template.Header.events({
	'click .logout'(event)
	{
		event.preventDefault();
		Meteor.logout();
		FlowRouter.go('/');
	}
});
