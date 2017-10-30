import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

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
});
