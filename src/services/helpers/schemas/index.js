const schemas = {
	planSchema: {
		reference: {
			type: String,
			required: true
		},
		planName: {
			type: String,
			required: true,
		},
		planDetails: {
			type: String,
			required: true
		},
		amountPerPayment: {
			type: Number,
			required: true
		}, 
		trialPeriodDuration: {
			type: String,
			required: false
		}, 
		expirationMonths: {
			type: String,
			required: true
		}
	},
}

module.exports = schemas;