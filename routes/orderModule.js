const cerealDB = require('../cerealDB.js');
const customerDB = require('../customerDB.js');
const orderDB = require('../orderDB.js');
const Cereal = cerealDB.getModel();
const Customer = customerDB.getModel();
const Order = orderDB.getModel();
const customerModule = require("./customerModule");
const adminModule = require("./adminModule");


function formatNum(num) {
    newNum = (Math.round(num * 100) / 100).toFixed(2);
	return newNum;
}

module.exports.formatNum = formatNum;

// Add order
// Gets data from promptNewOrderView, proccesses, renders addOrderView
module.exports.addNewOrder = async (req , res , next) => {

	cid = req.body.cid;

	let customer = await Customer.findById(cid);

	if (!customer){
		res.render('404');
	}
	else {

		let cereals = await Cereal.find({});

		// Display all cereals at the bottom
		let results = cereals.map( cer => {
			return {
				id: cer._id,
				name: cer.name,
				company: cer.company,
				description: cer.description,
				price: formatNum(cer.price),
				quantity: cer.quantity,
			}
		});
		
			
		res.render('addOrderView',
	  		{title:'Add a New Order', 
			  	cid: customer._id,
				fName: customer.fName,
				lName: customer.lName,
			    data: results             
			});

	} 
			
};


// Save order
// Gets data from addOrderView, processes, 
module.exports.saveNewOrder = async (req , res , next) => {

	let cid = req.body.cid;
    let cerealIds = req.body.cerealid; // not recognized
	let amounts = req.body.amtSelected; // not recognized	

	let customer = await Customer.findById(cid);

	var numItems = 0;
	var totalCost = 0;
	var itemArray = [];

	// Iterate cereals
	for(let i=0; i<cerealIds.length; i++){
				
		let id = cerealIds[i]
		let cereal = await Cereal.findById(id);
		let amtSelected = amounts[i];

		numItems += parseInt(amtSelected);

		if (amtSelected > 0){
			totalCost += parseInt(amtSelected) * parseFloat(cereal.price);	
			itemArray.push({
				"id":id, 
				"name":cereal.name,
				"company":cereal.company,
				"description":cereal.description,
				"price":cereal.price,
				"quantity":amtSelected, 
				});

			// Subtract each cereal quantity from DB
			cereal.quantity -= amtSelected;

			await cereal.save();
		}
	} // end for

	let order = new Order({
		cust_id:		cid,
		cust_fname:		customer.fName,
		cust_lname: 	customer.lName,
		items: 			itemArray,
		numItems:		numItems,
		totalCost:		totalCost
	}); 

	await order.save((err) => {
		if(err)
			console.log("Error : %s ",err);	
	});

	let oid = order._id;
	customer.activeOrders.push(oid);

	await customer.save((err) => {
		if(err)
			console.log("Error : %s ",err);	
	});


	res.redirect('/order/confirmOrder/' + order._id);
	
};


// Save order after customer registers
module.exports.saveOrderAfterReg = async function(cid, first, last, res) {
 
		let order = new Order({
			cust_id:		cid,
			cust_fname:		first,
			cust_lname: 	last,
			items: 			[],
			numItems:		0,
			totalCost:		0
		}); 

		await order.save((err) => {
			if(err)
				console.log("Error : %s ",err);	
		}); 

		const oid = order._id;

		let customer = await Customer.findById(cid);
		let orderArray = customer.activeOrders;
		orderArray.push(oid);

		//let orderArray = [oid];
		
		//customer.activeOrders.push(oid);
		//await customer.save();

		customer.activeOrders = orderArray;
		await customer.save();
		res.redirect('/order/editorder/' + oid.toString());
		
		
};


// Display orders
module.exports.displayOrders = async (req , res , next) => {

	let orders = await Order.find({});

	let results = orders.map( ord => {
		return {
			id: ord._id,
			cust_id: ord.cust_id,
			cust_fname: ord.cust_fname,
			cust_lname: ord.cust_lname, 
			numItems: ord.numItems,
			totalCost: formatNum(ord.totalCost)
		}
	});
	
	res.render('displayOrdersView',
			{title:"List of Orders", data:results});
	
};

// Edit order
module.exports.editOrder = async (req , res , next) => {

    let id = req.params.id;

	    let order = await Order.findById(id);

		let cereals = await Cereal.find({});

		function getCerOrderQty(cerealId){
			for(let i=0; i<order.items.length; i++){
				if(order.items[i].id == cerealId){
					return order.items[i].quantity;
				}
			}
			return 0;
		}

		// Display list of cereals this person ordered
		
			let items = order.items.map(element => {
				return {
					id: element.id,
					name: element.name,
					company: element.company,
					description: element.description,
					price: formatNum(element.price),
					quantity: element.quantity
				}
			});
		
			// Display all cereals at the bottom
			let results = cereals.map( cer => {
				return {
					id: cer._id,
					name: cer.name,
					company: cer.company,
					description: cer.description,
					price: formatNum(cer.price),
					quantity: cer.quantity,
					orderQty: getCerOrderQty(cer._id)
				}
			});
	     
	     if (!order){
	     		 res.render('404');
	     	}
	      else {

				// Display info about this order
		      	res.render('editOrderView',
		        {title:'Editing Order', role:'order',
				message:"This is a New Order - Add Items.",
				
				orderdata: {
					id: order._id,
					cust_id: order.cust_id,
					cust_fname: order.cust_fname,
					cust_lname: order.cust_lname,
					items: order.items,
					numItems: order.numItems,
					totalCost: formatNum(order.totalCost)
		            },

					data: results, items
		       	});                
	      }
};


// Save Order After Edit
module.exports.saveOrderAfterEdit = async (req , res , next) => {

	let orderId = req.body.orderid;
	let existingIds = req.body.existingIds; // cereal IDs before changes
    let cerealIds = req.body.cerealid; // all cereals IDs
	let amounts = req.body.amtSelected; // amounts user entered
	let prevAmts = req.body.prevAmt; // previous amts before user changes them

	    let order = await Order.findById(orderId);
		
	     if (!order) {
	     		 res.render('404', {title:'There was a Problem (404)'});
	     } else {

			for(let i=0; i<cerealIds.length; i++){
				
				let id = cerealIds[i]
				let cereal = await Cereal.findById(id);
				let amtSelected = amounts[i];
				let prevAmt = prevAmts[i];
				let newQty = 0;

				// If amt selected is MORE than prev amt
					// subtract from DB
					if(amtSelected > prevAmt){ //works
						newQty = cereal.quantity - (amtSelected - prevAmt);
						cereal.quantity = newQty;

						order.numItems += (amtSelected - prevAmt);
						order.totalCost += (amtSelected * cereal.price);
					}

				// If amt selected is LESS than prev amt
					// add to DB
					else if(amtSelected < prevAmt){
						newQty = cereal.quantity + (prevAmt - amtSelected);
						cereal.quantity = newQty;

						order.numItems -= (prevAmt - amtSelected);
						order.totalCost -= (prevAmt * cereal.price);
					}

				// If amt selected is SAME as prev amt
					// do nothing to DB
					else if(amtSelected == prevAmt){
						continue;
					}	
					await cereal.save();	

					// add cereal to order items
					if(prevAmt == 0 && amtSelected > 0){

						order.items.push({	
							"id":id, 
							"name":cereal.name,
							"company":cereal.company,
							"description":cereal.description,
							"price":cereal.price,
							"quantity":amtSelected, 
							});

					}
					
					// remove cereal from order items
					if(prevAmt > 0 && amtSelected == 0){

						// loop through all items in existing order
						// if current item's id matches this cereal id, delete
						for(let i=0; i<order.items.length; i++){
							let thisCer = order.items[i];
							if (thisCer["id"] == id){
								order.items.splice(i,1);
							}
						}
					}
					
					// if both > 0, update quantity of this cereal in order items
					if(prevAmt > 0 && amtSelected > 0){

						// loop through all items in existing order
						// if item id == cereal id, update quantity
						for(let i=0; i<order.items.length; i++){

							if (order.items[i]["id"] == id){
								let cerArray = order.items.splice(i,1);
								cerArray[0].quantity = amtSelected;
								order.items.unshift(cerArray[0]);	
							}
						}
					}	
			}

	        await order.save();
			res.redirect('/order/confirmOrder/' + order._id);
	     	}
 };

module.exports.confirmOrder = async (req , res , next) => {

	id = req.params.id;
	let order = await Order.findById(id);

	res.render('confirmOrderView', {
		title: "Order Completed", 
		action:'/customer/show/' + order.cust_id,
		button:'Home',
		orderdata: {
			id: order._id,
			cust_id: order.cust_id,
			cust_fname: order.cust_fname,
			cust_lname: order.cust_lname,
			items: order.items,
			numItems: order.numItems,
			totalCost: formatNum(order.totalCost)}
	});
};

// this function is hit when customer changes their name
module.exports.updateOrderOwner = async (cid, fName, lName, req) => {

	let orders = await Order.find({});
	let customer = await Customer.findById(cid);

	if (!orders || !customer) {
		res.render('404', {title:'There was a Problem (404)'});
	} else {
		
		for(let i=0; i<orders.length; i++){

			let order = orders[i];

			if(order.cust_id.toString() == customer._id.toString()){
				order.cust_fname = fName;
				order.cust_lname = lName;
				await order.save();
			}
		}

	}
};

 // Delete order
 module.exports.deleteOrder = async (req , res , next) => {
    
    let id = req.params.id;
	    
	let order = await Order.findById(id);

	if (!order) {
	    res.render('404');
	} else {
	    res.render('deleteOrderView', {
        title:'Delete This Order?', post:'/order/deleteorder/',
        data: {
            id: order._id,
			cid: order.cust_id,
			fName: order.cust_fname,
			lName: order.cust_lname,
            numItems: order.numItems,
			totalCost: formatNum(order.totalCost)}
        })
	    }   
  };

    // Delete customer After Confirm
	module.exports.deleteOrderAfterConfirm = async (req , res , next) => {
    
		// Fill in the code
		let id = req.body.id;
		let cid = req.body.cid
			
		let order = await Order.findById(id);
		let customer = await Customer.findById(cid);

		for(let i=0; i<customer.activeOrders.length; i++){

			if(customer.activeOrders[i].toString() == id){
				customer.activeOrders.splice(i,1);
			}
		}
	
		if (!order) {
			res.render('404', {title: 'There was a problem (404)'});
		} else {
			await customer.save()
			await order.remove();
			res.redirect('/customer/show/' + cid);

		}
		   
	};

// this function is hit when admin changes cereal name, description, etc.
module.exports.updateItemsInOrder = async (cid, cName, cCom, cDes, cPri, req) => {

	let orders = await Order.find({});

	// loop through all orders
	for(let i=0; i<orders.length; i++){ 

		let order = orders[i];
		let totalCost = orders[i].totalCost;

			// loop through items in each order
			for(let i=0; i<order.items.length; i++){ 

				let item = order.items[i];

				if (item.id == cid){ 

					let itemPrice = item.price; // 5.00
					let itemQuan = item.quantity; //2
					let itemCost = 0;

					itemCost = itemPrice * itemQuan;
					order.totalCost -= itemCost;

					let cerArray = order.items.splice(i,1);
					cerArray[0].name = cName;
					cerArray[0].name = cName;
					cerArray[0].description = cDes;
					cerArray[0].company = cCom;
					cerArray[0].price = cPri;

					order.items.unshift(cerArray[0]);
					
					let newItemCost = cPri * itemQuan;
					order.totalCost += newItemCost;
				}
			}

		await order.save();
	}
}