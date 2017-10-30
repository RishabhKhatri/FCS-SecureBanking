import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { Transactions } from '../api/transactions.js'
import './newTransaction.html';

Template.NewTrans.events({
	'change .type-select'(event)
	{
		const target = event.target;
		if (target.value == "credit") {
			console.log("true");
			document.getElementById("from").disabled = true;
			document.getElementById("to").disabled = true;
		}
		else
		{
			document.getElementById("from").disabled = false;
			document.getElementById("to").disabled = false;
		}
	},
	'submit form'(event)
	{
		event.preventDefault();
		const target = event.target;
		var fromVar = target.transFrom.value;
		var toVar = target.transTo.value;
		var amountVar = Number(target.transAmount.value);
		var typeVar = target.transType.value;
		var passVar = Package.sha.SHA256(target.transPass.value);
		Meteor.call('transactions.check_pass', passVar, function(err, result) {
			console.log(result);
			if (result) {
				Meteor.call('transactions.insert', fromVar, toVar, amountVar, typeVar);
				FlowRouter.go('/passbook');
				FlashMessages.sendSuccess("Transaction successfull!");
			}
			else
			{
				FlowRouter.go('/');
				FlashMessages.sendWarning("Incorrect Password!");
			}
		});
	},
});
