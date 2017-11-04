import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

export const Transactions = new Mongo.Collection('transactions');

if (Meteor.isServer) {
	Meteor.publish('transactions', function transactionsPublication() {
		if (Roles.userIsInRole(Meteor.userId(), ["manager"])) {
			return Transactions.find();
		}
		if (Roles.userIsInRole(Meteor.userId(), "regular")) {
			return Transactions.find({ amount: {$lt: 50000} });
		}
		return Transactions.find({ owner: this.userId });
	})
}

Meteor.methods({
	'transactions.request'(from, to, amount, type)
	{
		check(from, String);
		check(to, String);
		check(amount, Number);
		check(type, String);

		if (!Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ["normal", "company"])) {
			throw new Meteor.Error("Not authorized");
		}

		if (type.toLowerCase() == "debit") {
			if (Meteor.isServer) {
				const to_user = Accounts.findUserByEmail(to);
				if (amount>Meteor.user().profile.balance) {
					throw new Meteor.Error("Insufficient balance!");
				}
				if (to_user) {
					return Transactions.insert({
						from,
						to,
						amount,
						type: "Debit",
						verified: false,
						status: "Pending",
						createdAt: new Date(),
						owner: Meteor.userId(),
					});
				}
				else
				{
					throw new Meteor.Error("Incorrect user!");
				}
			}
		}
		else
		{
			return Transactions.insert({
				from: Meteor.user().profile.email,
				to: Meteor.user().profile.email,
				amount,
				type: "Credit",
				verified: false,
				status: "Pending",
				createdAt: new Date(),
				owner: Meteor.userId(),
			});
		}
	},
	'transactions.insert'(id, from, to, amount, type)
	{
		check(id, String);
		check(from, String);
		check(to, String);
		check(amount, Number);
		check(type, String);

		if (!Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ["admin", "regular", "manager"])) {
			throw new Meteor.Error("Not authorized");
		}

		if (type.toLowerCase() == "debit") {
			if (Meteor.isServer) {
				const from_user = Accounts.findUserByEmail(from);
				const to_user = Accounts.findUserByEmail(to);
				var prev_balance;
				var current_balance = from_user.profile.balance;
				prev_balance = current_balance;
				current_balance -= amount;
				console.log(current_balance);
				Meteor.users.update(from_user._id, {$set: { "profile.balance": current_balance }});
				type="Debit";
				Transactions.update(id, {$set: {
					prev_balance: prev_balance,
					current_balance: current_balance,
					verified: true,
					status: "Accepted",
				}});
				current_balance = to_user.profile.balance;
				prev_balance = current_balance;
				current_balance += amount;
				console.log(current_balance);
				Meteor.users.update(to_user._id, {$set: { "profile.balance": current_balance }});
				type = "Credit";
				Transactions.insert({
					from,
					to,
					amount,
					prev_balance,
					current_balance,
					type,
					verified: true,
					status: "Accepted",
					createdAt: new Date(),
					owner: to_user._id,
				});
			}
		}
		else if(type.toLowerCase() == 'credit')
		{
			if (Meteor.isServer) {
				const from_user = Accounts.findUserByEmail(from);
				var prev_balance;
				var current_balance = from_user.profile.balance;
				prev_balance = current_balance;
				current_balance += amount;
				console.log(current_balance);
				Meteor.users.update(from_user._id, {$set: { "profile.balance": current_balance }});
				type="Credit";
				Transactions.update(id, {$set: {
					prev_balance: prev_balance,
					current_balance: current_balance,
					verified: true,
					status: "Accepted",
				}});
			}
		}
	},
	'transactions.check_pass'(digest)
	{
		check(digest, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error("Not authorized");
			return false;
		}
		else
		{
			var user = Meteor.user();
			var password = {digest: digest, algorithm: 'sha-256'};
			if (Meteor.isServer) {
				var result = Accounts._checkPassword(user, password);
				return result.error == null;
			}
		}
	},
	'transactions.reject'(id)
	{
		check(id, String);

		if (!Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ["admin", "regular", "manager"])) {
			throw new Meteor.Error("Not authorized");
		}
		
		Transactions.update(id, {$set: {status: "Rejected", verified: true,}});
	},
	'transactions.sendOTP'(id)
	{
		check(id, String);

		if (!Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ["normal", "company"])) {
			throw new Meteor.Error("Not authorized");
			return false;
		}

		const OTP = Math.floor(100000 + Math.random() * 900000);
		const body = "<p>Here is your OTP: <strong>" + OTP + "</strong>.</p>";

		Email.send({
			to: Meteor.user().profile.email,
			from: "admin@fcsbank.com",
			subject: "OTP for FCS-SecureBank",
			html: body,
		});
		Transactions.update(id, {$set: {
			otp: OTP,
			otpVerified: false,
		}});
	},
	'transactions.checkOTP'(id, otpVer)
	{
		check(id, String);
		check(otpVer, Number);

		if (!Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ["normal", "company"])) {
			throw new Meteor.Error("Not authorized");
			return false;
		}

		const OTP = Transactions.findOne(id).otp;
		if (OTP === otpVer) {
			Transactions.update(id, {$set: {
				otpVerified: true,
			}});
			return true;
		}
		else{
			Transactions.remove(id);
			return false;
		}
	},
	'transactions.removeOTP'()
	{
		if (!Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ["normal", "company"])) {
			throw new Meteor.Error("Not authorized");
			return false;
		}

		Transactions.find({otpVerified: {$eq: false}}).forEach(function(element) {
			Transactions.remove(element._id);
			console.log(element._id);
		});
	},
	'transactions.remove'(id)
	{
		check(id, String);

		if (!Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ["normal", "company"])) {
			throw new Meteor.Error("Not authorized");
			return false;
		}

		Transactions.remove(id);
	}
});
