import { Meteor } from 'meteor/meteor';

Router.configure({
	layoutTemplate: "MainLayout"
});

Router.route('/', {
	name: "homeRoute",
	template: "Home",
});

Router.route('/profile', {
	name: "profileRoute",
	template: "Profile",
	onBeforeAction: function() {
		var current_user = Meteor.userId();
		if (current_user) {
			this.next();
		}
		else
		{
			this.render("Home");
		}
	}
});

Router.route('/transactions/new', {
	name: "newTransRoute",
	template: "NewTrans",
	onBeforeAction: function() {
		var current_user = Meteor.userId();
		if (current_user) {
			this.next();
		}
		else
		{
			this.render("Home");
		}
	}
});

Router.route('/transactions/history', {
	name: "historyRoute",
	template: "History",
	onBeforeAction: function() {
		var current_user = Meteor.userId();
		if (current_user) {
			this.next();
		}
		else
		{
			this.render("Home");
		}
	}
});

Router.route('/requests', {
	name: "requestsRoute",
	template: "Requests",
	onBeforeAction: function() {
		var current_user = Meteor.userId();
		if (current_user && Roles.userIsInRole(current_user, "admin")) {
			this.next();
		}
		else
		{
			this.render("Home");
		}
	}
});

Router.route('/get_started', {
	name: "startRoute",
	template: "GetStarted",
	onBeforeAction: function() {
		var current_user = Meteor.userId();
		if (current_user) {
			this.next();
		}
		else
		{
			this.render("Home");
		}
	}
});

Router.route('/settings', {
	name: "settingsRoute",
	template: "Home",
	onBeforeAction: function() {
		var current_user = Meteor.userId();
		if (current_user) {
			this.next();
		}
		else
		{
			this.render("Home");
		}
	}
});
