const schemas = require('../schemas');

const checkData = (schemaName, data) => {
	const schema = schemas[schemaName];
	return Object.keys(schema).every(key => {
		console.log(key);
		// Testing each [key] based in the schema specification and return TRUE or FALSE
		if (data[key] !== undefined || data[key] !== null) {
			if (schema[key].required && data[key] === '') return false;
			if (data.hasOwnProperty(key) && typeof data[key] === typeof (schema[key].type(data[key]))) return true;
			return false;
		}
		return false;
	})

}

module.exports = checkData;
