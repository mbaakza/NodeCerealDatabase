const { Double } = require('mongodb');
const mongoose = require('mongoose');
const credentials = require("./credentials.js");

const dbUrl = 'mongodb+srv://' + credentials.username + ':' + 
	credentials.password + '@' + credentials.host + '/' + 
	credentials.database + '?retryWrites=true&w=majority';

let connection = null;
let model = null;

let Schema = mongoose.Schema;

let orderSchema = new Schema({
	//orderNum: String,
	cust_id: Object,
	cust_fname: String,
	cust_lname: String,
	items: Array,
	numItems: Number,
	totalCost: Number
}, {
	
	collection: 'orders'
});


module.exports.getModel = 	
	() => {
		if (connection == null) {
			console.log("Creating connection and model...");
			connection = mongoose.createConnection(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
			model = connection.model("OrderModel", 
							orderSchema);
		};
		return model;
	};

























