const { Double } = require('mongodb');
const mongoose = require('mongoose');
const credentials = require("./credentials.js");

const dbUrl = 'mongodb+srv://' + credentials.username + ':' + 
	credentials.password + '@' + credentials.host + '/' + 
	credentials.database + '?retryWrites=true&w=majority';

let connection = null;
let model = null;

let Schema = mongoose.Schema;

let customerSchema = new Schema({
	fName: String,
	lName: String,
	activeOrders: Array,
}, {
	
	collection: 'customers'
});


module.exports.getModel = 	
	() => {
		if (connection == null) {
			console.log("Creating connection and model...");
			connection = mongoose.createConnection(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
			model = connection.model("CustomerModel", 
							customerSchema);
		};
		return model;
	};

























