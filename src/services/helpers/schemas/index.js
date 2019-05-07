const schemas = {
	planSchema: {
		reference: { type: String, required: true	},
		planName: {	type: String,	required: true },
		planDetails: { type: String, required: true },
		amountPerPayment: { type: Number, required: true }, 
		trialPeriodDuration: { type: String, required: false }, 
		expirationMonths: { type: String, required: true }
	},
	customerSchema: { 
		planCode: {	type: String, required: true },
		paymentHash: { type: String, required: true },
		senderName: { type: String, required: true },
		senderEmail: { type: String, required: true },
		senderPhoneArea: { type: String, required: true },
		senderPhoneNumber: { type: String, required: true },
		senderAddrStreet: { type: String, required: true },
		senderAddrNumber: { type: String, required: true },
		senderAddrComplement: { type: String, required: false },
		senderAddrDistrict: { type: String, required: true },
		senderAddrCity: { type: String, required: true },
		senderAddrState: { type: String, required: true },
		senderAddrPostalCode: { type: String, required: true },
		senderCPF: { type: String, required: true },
		holderName: { type: String, required: true },
		holderBirthDate: { type: String, required: true },
		holderCPF: { type: String, required: true },
		holderPhoneArea: { type: String, required: true },
		holderPhoneNumber: { type: String, required: true },
		creditCardToken: { type: String, required: true }
	},
	discountSchema: {
		code: { type: String, required: true },
		value: { type: Number, required: true }
	}
}

module.exports = schemas;