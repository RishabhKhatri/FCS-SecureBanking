import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

if (Meteor.isServer) {
	Meteor.publish('Users', function userPublication() {
		return Meteor.users.find();
	})
}

Meteor.methods({
	'client.insertRole'(userId, typeVar)
	{
		check(userId, String);
		check(typeVar, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error("Not authorized");
			FlashMessages.sendError("Not authorized.");
		}

		Roles.addUsersToRoles(userId, [typeVar]);
	},
	'client.verify'(userId)
	{
		check(userId, String);

		if (!Meteor.userId() && Roles.userIsInRole(Meteor.userId(), "admin")) {
			throw new Meteor.Error("Not authorized");
			FlashMessages.sendError("Not authorized.");
			return false;
		}

		Meteor.users.update({_id: userId}, {$set: {"profile.verified": true}});
		return true;
	},
	'client.remove'(userId)
	{
		check(userId, String);

		if (!Meteor.userId() && Roles.userIsInRole(Meteor.userId(), "admin")) {
			throw new Meteor.Error("Not authorized");
			FlashMessages.sendError("Not authorized.");
			return false;
		}

		Meteor.users.remove(userId);
		return true;
	},
	'client.addAccount'(emailVar, nameVar, contactVar, passVar)
	{
		check(emailVar, String);
		check(nameVar, String);
		check(contactVar, String);
		check(passVar, String);


		if (!Meteor.userId() && Roles.userIsInRole(Meteor.userId(), "admin")) {
			throw new Meteor.Error("Not authorized");
			FlashMessages.sendError("Not authorized.");
			return false;
		}

		return Accounts.createUser({
			email: emailVar,
			password: passVar,
			profile: {
				name: nameVar,
				contact: contactVar,
				email: emailVar,
				balance: 0,
				verified: true,
			}
		});
	}
});
