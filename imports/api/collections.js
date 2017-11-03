import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

if (Meteor.isServer) {
	Meteor.publish('Users', function userPublication() {
		return Meteor.users.find();
	});
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
				verified: true,
			}
		});
	},
	'admin.check_pass'(digest)
	{
		check(digest, String);

		if (!Meteor.userId() && Roles.userIsInRole(Meteor.userId(), "admin")) {
			throw new Meteor.Error("Not authorized");
			FlashMessages.sendError("Not authorized.");
			return false;
		}

		var user = Meteor.user();
		var password = {digest: digest, algorithm: 'sha-256'};
		if (Meteor.isServer) {
			var result = Accounts._checkPassword(user, password);
			return result.error == null;
		}
	},
	'client.check_captcha'(captchaData)
	{
		var verifyCaptchaResponse = reCAPTCHA.verifyCaptcha(this.connection.clientAddress, captchaData);

        if (!verifyCaptchaResponse.success) {
            console.log('reCAPTCHA check failed!', verifyCaptchaResponse);
            throw new Meteor.Error(422, 'reCAPTCHA Failed: ' + verifyCaptchaResponse.error);
        } else
            console.log('reCAPTCHA verification passed!');
        return true;
	},
	'client.request'()
	{
		if (!Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ["normal", "company"])) {
			throw new Meteor.Error("Not authorized");
			FlashMessages.sendError("Not authorized.");
			return false;
		}

		Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.change_request": false, "profile.request_sent": true}});
	},
	'client.accept_request'(userId)
	{
		check(userId, String);

		if (!Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ["admin", "regular"])) {
			throw new Meteor.Error("Not authorized");
			FlashMessages.sendError("Not authorized.");
			return false;
		}

		Meteor.users.update({_id: userId}, {$set: {"profile.change_request": true, "profile.request_sent": false}});
	},
	'client.reject_request'(userId)
	{
		check(userId, String);

		if (!Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ["admin", "regular"])) {
			throw new Meteor.Error("Not authorized");
			FlashMessages.sendError("Not authorized.");
			return false;
		}

		Meteor.users.update({_id: userId}, {$set: {"profile.change_request": false, "profile.request_sent": false}});
	},
	'client.update'(name, contact)
	{
		check(name, String);
		check(contact, String);

		if (!Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ["normal", "company"])) {
			throw new Meteor.Error("Not authorized");
			FlashMessages.sendError("Not authorized.");
			return false;
		}

		Meteor.users.update({_id: Meteor.userId()}, {$set: {
			"profile.name": name,
			"profile.contact": contact,
			"profile.change_request": false,
			"profile.request_sent": false,
		}});
	}
});
