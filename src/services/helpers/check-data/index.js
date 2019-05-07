const crypto = require('crypto');
const { normalizeDiacritics } = require('normalize-text');
const schemas = require('../schemas');

const checkDataBasedOnSchema = (schemaName, data) => {
	const schema = schemas[schemaName];
	return Object.keys(schema).every(key => {
		/* Testing each [key] based in the schema specification and return TRUE or FALSE */
		if (data[key] !== undefined || data[key] !== null) {
			if (schema[key].required && data[key] === '') return false;
			if (data.hasOwnProperty(key) && typeof data[key] === typeof (schema[key].type(data[key]))) return true;
			return false;
		}
		return false;
	})
}

const checkAndMountCustomer = (customer) => {
	return {
		plan: customer.planCode,
		reference: crypto.randomBytes(10).toString('hex'),
		sender: {
			name: normalizeDiacritics(customer.senderName),
			email: customer.senderEmail,
			hash: customer.paymentHash,
			phone: {
				areaCode: customer.senderPhoneArea,
				number: customer.senderPhoneNumber
			},
			address: {
				street: normalizeDiacritics(customer.senderAddrStreet),
				number: customer.senderAddrNumber,
				complement: normalizeDiacritics(customer.senderAddrComplement),
				district: normalizeDiacritics(customer.senderAddrDistrict),
				city: normalizeDiacritics(customer.senderAddrCity),
				state: customer.senderAddrState,
				country: 'BRA',
				postalCode: customer.senderAddrPostalCode
			},
			documents: [{
				type: 'CPF',
				value: customer.senderCPF
			}]
		},
		paymentMethod: {
			type: 'CREDITCARD',
			creditCard: {
				token: customer.creditCardToken,
				holder: {
					name: normalizeDiacritics(customer.holderName),
					birthDate: customer.holderBirthDate,
					documents: [{
						type: 'CPF',
						value: customer.holderCPF
					}],
					phone: {
						areaCode: customer.holderPhoneArea,
						number: customer.holderPhoneNumber
					},
					billingAddress: {
						street: normalizeDiacritics(customer.senderAddrStreet),
						number: customer.senderAddrNumber,
						complement: normalizeDiacritics(customer.senderAddrComplement),
						district: normalizeDiacritics(customer.senderAddrDistrict),
						city: normalizeDiacritics(customer.senderAddrCity),
						state: customer.senderAddrState,
						country: 'BRA',
						postalCode: customer.senderAddrPostalCode
					}
				}
			}
		}
	}
}

module.exports = { checkDataBasedOnSchema, checkAndMountCustomer };
