import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

export const Transactions = new Mongo.Collection('transactions');

if (Meteor.isServer) {
	Meteor.publish('transactions', function transactionsPublication() {
		// body...
		return Transactions.find({ owner: this.userId });
	})
}

Meteor.methods({
	'transactions.insert'(from, to, amount, type)
	{
		check(from, String);
		check(to, String);
		check(amount, Number);
		check(type, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error("Not authorized");
		}

		if (type.toLowerCase() == "debit") {
			if (Meteor.isServer) {
				const to_user = Accounts.findUserByEmail(to);
				if (to_user) {
					from = Meteor.user().profile.email;
					var prev_balance_;
					var current_balance = Meteor.user().profile.balance;
					if (amount>current_balance) {
						throw new Meteor.Error("Insufficient balance!");
					}
					prev_balance = current_balance;
					current_balance -= amount;
					console.log(current_balance);
					Meteor.users.update(Meteor.userId(), {$set: { "profile.balance": current_balance }});
					type="Debit";
					Transactions.insert({
						from,
						to,
						amount,
						prev_balance,
						current_balance,
						type,
						createdAt: new Date(),
						owner: Meteor.userId(),
					});
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
						createdAt: new Date(),
						owner: to_user._id,
					});
				}
				else
				{
					throw new Meteor.Error("Incorrect user!");
				}
			}
		}
		else if(type.toLowerCase() == 'credit')
		{
			from=Meteor.user().profile.email;
			to=Meteor.user().profile.email;
			var prev_balance;
			var current_balance = Meteor.user().profile.balance;
			prev_balance = current_balance;
			current_balance += amount;
			console.log(current_balance);
			Meteor.users.update(Meteor.userId(), {$set: { "profile.balance": current_balance }});
			type="Credit";
			Transactions.insert({
				from,
				to,
				amount,
				prev_balance,
				current_balance,
				type,
				createdAt: new Date(),
				owner: Meteor.userId(),
			});
		}
	},
	'transactions.remove'(transactionId)
	{
		check(transactionId, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		const transaction = Transactions.findOne(transactionId);
		if (Meteor.userId() != transaction.owner) {
			throw new Meteor.Error('not-authorized');
		}

		Transactions.remove(transactionId);
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
	}
});
