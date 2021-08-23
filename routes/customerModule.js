const cerealDB = require('../cerealDB.js');
const customerDB = require('../customerDB.js');
const orderDB = require('../orderDB.js');
const Cereal = cerealDB.getModel();
const Customer = customerDB.getModel();
const Order = orderDB.getModel();
const orderModule = require("./orderModule");

// Customer Homepage
module.exports.customerLogin = async (req , res , next) => {

	let cid = req.body.cid;
	
	var mongoose = require('mongoose'); 

	if(mongoose.Types.ObjectId.isValid(cid)){
		let customer = await Customer.findById(cid);

		if(!customer){
			res.render('404', {
				title:'Invalid ID',
				name:'Customer with ID ' + cid + ' does not exist.'});
		} else {
			res.redirect('/customer/show/' + cid);
		}

	} else if(!mongoose.Types.ObjectId.isValid(cid)){
		res.render('404', {
			title:'Invalid ID',
			name:'Customer with ID ' + cid + ' does not exist.'});
	}

};

// Customer Homepage
module.exports.customerHome = async (req , res , next) => {
	
	let cid = req.params.id;
	let customer = await Customer.findById(cid);

	res.render('customerHomeView', {
		title:"Customer Home", 
		cid:cid,
		fName:customer.fName,
		lName:customer.lName
	});  
};

// Display customers
module.exports.displayCustomers = async (req , res , next) => {

	let customers = await Customer.find({});

	let results = customers.map( cust => {
		return {
			id: cust._id,
			fName: cust.fName,
			lName: cust.lName,
			activeOrders: cust.activeOrders,
			size: cust.activeOrders.length
		}
	});
		
	res.render('displayCustomersView',
			{title:"List of Customers", data:results});
	
};

// Display One Customer
module.exports.displaySingleCustomer = async (req , res , next) => {

	let id = req.params.id;
	let customer = await Customer.findById(id);

	let results = {
			id: customer._id,
			fName: customer.fName,
			lName: customer.lName,
			activeOrders: customer.activeOrders,
	}

	let orderArray = customer.activeOrders.map(order => {
		return {
			role:"order",
			orderNum:order
		}
	});

	res.render('displaySingleCustomerView', 
			{title:"Customer Information", data:results, id:id,
			editCall:"Edit My Name", deleteCall:"Delete My Account",
			orderData:orderArray, role:'order'});
};


// Add customer
module.exports.addCustomer = (req , res , next) => {

	res.render('addCustomerView', 
	  	{title:"Register New Customer"});
};


 // Save customer
 module.exports.saveCustomer = async (req , res , next) => {
 
	if (req.body.cfname && req.body.clname){

		let first = req.body.cfname.toUpperCase();
		let last = req.body.clname.toUpperCase()

		let customer = new Customer({
			fName:	first,
			lName:	last,
			activeOrders: []
		}); 
	 
		await customer.save((err) => {
		if(err)
			console.log("Error : %s ",err);		
		});

		const cid = customer._id;
		orderModule.saveOrderAfterReg(cid, first, last, res);
		
	}; 
};



  // Edit customer
module.exports.editCustomer = async (req , res , next) => {

    let id = req.params.id;

	    let customer = await Customer.findById(id);
	     
	     if (!customer){
	     		 res.render('404');
	     	}
	      else {
		      	res.render('editCustomerView', 
		        {title:'Editing', role:"customer",
		        	data: {
					id: customer._id,
					fName: customer.fName,
					lName: customer.lName,
		            }
		       	});                
	      }
    
};


// Save After Edit
module.exports.saveCustAfterEdit = async (req , res , next) => {

    // Fill in the code
    let cid = req.body.id;

	    let customer = await Customer.findById(cid);

	     if (!customer) {
	     		 res.render('404', {title:'There was a Problem (404)'});
	     } else {

			let fName = req.body.cfname.toUpperCase();
			let lName = req.body.clname.toUpperCase()

			customer.fName = fName;
			customer.lName = lName;
			orderModule.updateOrderOwner(customer._id, fName, lName);

			await customer.save();

	        res.redirect('/customer/displaySingleCustomer/' + cid);
	     }

 };

 // Delete customer
module.exports.deleteCustomer = async (req , res , next) => {
    
    // Fill in the code
    let id = req.params.id;
	    
	let customer = await Customer.findById(id);

	if (!customer) {
	    res.render('404');
	} else {
	    res.render('deleteCustomerView', {
		role:'customer',	
        title:'Delete Customer and All Associated Orders?',
        data: {
            fName: customer.fName,
			lName: customer.lName,
            id: customer.id}
        })
	    }   
  };

  // Delete customer After Confirm
  module.exports.deleteCustomerAfterConfirm = async (req , res , next) => {
    
    // Fill in the code
    let cid = req.body.id;
	let orders = await Order.find({});

	for(let i=0; i<orders.length; i++){
		let order = orders[i];
		if (order.cust_id == cid){
			await order.remove();
		} 
	}
	    
	let customer = await Customer.findById(cid);

	if (!customer) {
	    res.render('404', {title: 'There was a problem (404)'});
	} else {
	    await customer.remove();
	    res.redirect('/');
	}
       
};

module.exports.confirmOrder = async (req , res , next) => {
	res.redirect('/customer')
}