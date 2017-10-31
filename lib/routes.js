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
		var current_user_id = Meteor.userId();
		var current_user = Meteor.user();
		if (current_user_id && current_user.profile.verified) {
			this.next();
		}
		else
		{
			FlashMessages.sendError("Unauthorized access!");
			Router.go("homeRoute");
		}
	}
});

Router.route('/transactions/new', {
	name: "newTransRoute",
	template: "NewTrans",
	onBeforeAction: function() {
		var current_user_id = Meteor.userId();
		var current_user = Meteor.user();
		if (current_user_id && current_user.profile.verified && Roles.userIsInRole(current_user, ["normal", "company"])) {
			this.next();
		}
		else
		{
			FlashMessages.sendError("Unauthorized access!");
			Router.go("homeRoute");
		}
	}
});

Router.route('/transactions/history', {
	name: "historyRoute",
	template: "History",
	onBeforeAction: function() {
		var current_user_id = Meteor.userId();
		var current_user = Meteor.user();
		if (current_user_id && current_user.profile.verified && Roles.userIsInRole(current_user, ["normal", "company"])) {
			this.next();
		}
		else
		{
			FlashMessages.sendError("Unauthorized access!");
			Router.go("homeRoute");
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
		if (!current_user) {
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
		var current_user_id = Meteor.userId();
		var current_user = Meteor.user();
		if (current_user_id && current_user.profile.verified) {
			this.next();
		}
		else
		{
			FlashMessages.sendError("Unauthorized access!");
			Router.go("homeRoute");
		}
	}
});

Router.route('/accounts/new', {
	name: "addInternalRoute",
	template: "AddInternal",
	onBeforeAction: function() {
		var current_user_id = Meteor.userId();
		var current_user = Meteor.user();
		if (current_user_id && current_user.profile.verified) {
			this.next();
		}
		else
		{
			FlashMessages.sendError("Unauthorized access!");
			Router.go("homeRoute");
		}
	}
});
