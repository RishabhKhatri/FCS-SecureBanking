import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { Transactions } from '../api/transactions.js';

import '../api/collections.js';
import './body.html';
import './register.html';
import './login.html';
import './home.html';
import './register.js';
import './login.js';
import './profile.html';
import './sidebar.html';
import './newTransaction.html';
import './newTransaction.js';
import './history.html';
import './history.js';
import './requests.html';
import './requests.js';
import './add_internal.html';
import './add_internal.js';
import './manage_accounts.html';
import './manage_accounts.js';
import './transaction_requests.html';
import './transaction_requests.js';
import './settings.html';
import './settings.js';

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
		Router.go('homeRoute');
	},
	'click .button-collapse': function(event){
	    $('.button-collapse').sideNav();
	}
});
