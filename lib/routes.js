import { Meteor } from 'meteor/meteor';

FlowRouter.route('/get_started', {
	action: function () {
		// body...
		if (!Meteor.userId()) {
			BlazeLayout.render('MainLayout', { main: 'GetStarted' });
		}
		else
		{
			console.log("Already logged in.");
		}
	},
	name: "get_started",
});

FlowRouter.route('/profile', {
	action: function()
	{
		if (Meteor.userId()) {
			BlazeLayout.render('MainLayout', { main: 'Profile' });
			// console.log(Roles.userIsInRole( Meteor.userId(), 'company' ));
		}
		else
		{
			FlashMessages.sendInfo("Not authorized.");
			FlowRouter.go('/');
		}
	},
	name: "profile",
});

FlowRouter.route('/new/transaction', {
	action: function()
	{
		if (Meteor.userId()) {
			BlazeLayout.render('MainLayout', { main: 'NewTrans' });
			// console.log(Roles.userIsInRole( Meteor.userId(), 'company' ));
		}
		else
		{
			FlashMessages.sendInfo("Not authorized.");
			FlowRouter.go('/');
		}
	},
	name: "new_trans",
});

FlowRouter.route('/passbook', {
	action: function()
	{
		if (Meteor.userId()) {
			BlazeLayout.render('MainLayout', { main: 'History' });
			// console.log(Roles.userIsInRole( Meteor.userId(), 'company' ));
		}
		else
		{
			FlashMessages.sendInfo("Not authorized.");
			FlowRouter.go('/');
		}
	},
	name: "history",
});

FlowRouter.route('/', {
	action: function () {
		// body...
		BlazeLayout.render('MainLayout', { main: 'Home' });
	},
	name: "home",
});

var transactions = FlowRouter.group({
	prefix: "/documents",
});

transactions.route('/new', {

});