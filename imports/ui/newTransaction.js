import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

import { Transactions } from '../api/transactions.js'
import './newTransaction.html';

Template.NewTrans.onRendered(function() {
	$('.register-form').validate({
		rules:
		{
			transFrom: {
				email: true,
				required: true,
			},
			transTo: {
				required: true,
				email: true,
			},
			transAmount: {
				required: true,
				number: true,
			},
			transType: {
				required: true,
			},
			transPass: {
				required: true,
			}
		}
	});
	$('.modal').modal();
});

Template.NewTrans.onCreated(function() {
	this.transactionId = new ReactiveVar(null);
});

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
	'submit .register-form'(event, template)
	{
		event.preventDefault();
		const target = event.target;
		var fromVar = target.transFrom.value;
		var toVar = target.transTo.value;
		var amountVar = Number(target.transAmount.value);
		var typeVar = target.transType.value;
		var passVar = Package.sha.SHA256(target.transPass.value);
		Meteor.call('transactions.check_pass', passVar, function(err, result) {
			if (result) {
				Meteor.call('transactions.request', fromVar, toVar, amountVar, typeVar, function(err, result) {
					if (err) {
						FlashMessages.sendError(err);
						Router.go("homeRoute");
					}
					else {
						Meteor.call('transactions.sendOTP', result);
						template.transactionId.set(result);
						document.getElementById("otpbutton").click();
						// Router.go('historyRoute');
						// FlashMessages.sendSuccess("Transaction requested!");
					}
				});
			}
			else
			{
				Router.go('homeRoute');
				FlashMessages.sendWarning("Incorrect Password!");
			}
		});
	},
	'submit .otp-form'(event)
	{
		event.preventDefault();
		console.log(event);
		const target = event.target;
		const otpVal = target.transOTP.value;
		Meteor.call('transactions.checkOTP', Template.instance().transactionId.get(), Number(otpVal), function(err, result)
		{
			if (err) {
				FlashMessages.sendError(err);
				Router.go('homeRoute');
			}
			else
			{
				if (result) {
					FlashMessages.sendSuccess("OTP verified");
					Router.go('historyRoute');
				}
				else
				{
					FlashMessages.sendSuccess("Incorrect OTP!");
					Router.go('homeRoute');
				}
			}
		})
	},
	'focus #otp_input'(event)
	{
		$('#otp_input').keyboard({
			layout: 'num',
			restrictInput: true,
			preventPaste: true,
			autoAccept: true,
		});
	}
});
