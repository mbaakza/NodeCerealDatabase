const cerealDB = require('../cerealDB.js');
const customerDB = require('../customerDB.js');
const orderDB = require('../orderDB.js');
const Cereal = cerealDB.getModel();
const Customer = customerDB.getModel();
const Order = orderDB.getModel();
const customerModule = require("./customerModule");
const orderModule = require("./orderModule");

module.exports.getRole = (req , res , next) => {

try{

	res.render('home', 
	  	{title:"Please Select Role"}); 

} catch(e){
	console.log(e);
}

};

// Admin Homepage
module.exports.adminHome = (req , res , next) => {

try{
	
	// if(req.body.userName && req.body.password && 
	// 	req.body.userName.toUpperCase() == "ADMIN" && 
	// 		req.body.password == "admin"){

			res.redirect('/admin/cereals');
	// } 
	
	// else{
	// 	res.render('404', {
	// 		title:'Invalid Login Credentials',
	// 		name:'Admin, please re-enter login credentials.'})
	// }
	
} catch(e){
	console.log(e);
}

};

// Add cereal
module.exports.addCereal = (req , res , next) => {
try{
	res.render('addCerealView', 
	  	{title:"Add a New Cereal"});
}catch (e) {
	console.log(e);
}		  
};

// Delete cereal
module.exports.deleteCereal = async (req , res , next) => {

	try{
    
    // Fill in the code
    let id = req.params.id;
	    
	let cereal = await Cereal.findById(id);

	if (!cereal) {
	    res.render('404');
	} else {
	    res.render('deleteCerealView', {
        title:'Deleting',
        data: {
            name: cereal.name,
			company: cereal.company,
            description: cereal.description,
			price: cereal.price,
			quantity: cereal.quantity,
            id: cereal.id}
        })
	    } 
		
	} catch (e) {
		console.log(e);
	}
  };

  // Delete cereal After Confirm
  module.exports.deleteCerealAfterConfirm = async (req , res , next) => {

	try{
    
    // Fill in the code
    let id = req.body.id;
	    
	let cereal = await Cereal.findById(id);

	if (!cereal) {
	    res.render('404', {title: 'There was a problem (404)'});
	} else {
	    //await cereal.remove();
		await cereal.deleteOne();
	    res.redirect('/admin');
	}
}catch (e) {
	console.log(e);
}       
};

module.exports.searchCereals = async (req , res , next) => {

try{	
	// Common stuff
	let cereals = await Cereal.find({});
	let results = [];
	var count = 0;

	// Search term stuff comes from URL
	let query = "null";

	// if req.params.query
	if(req.params.query){
		query = req.params.query.toUpperCase();
	}

	// else if req.body.searchbox
	else if(req.body.searchBox){
		query = req.body.searchBox.toUpperCase();
	}

	for(let i=0; i<cereals.length; i++){
		let cer = cereals[i];

		function createOutput(){
				count++;

				results.push({
					id: cer._id,
					name: cer.name,
					company: cer.company,
					description: cer.description,
					price: orderModule.formatNum(cer.price),
					quantity: cer.quantity
				})				
		}

		if(query != "null") {

			if(cer.name.includes(query) || cer.description.includes(query) || 
			cer.company.includes(query)){
				createOutput();
			}
		}

		else if(req.params.min && req.params.max){
			let min = orderModule.formatNum(parseFloat(req.params.min));
			let max = orderModule.formatNum(parseFloat(req.params.max));
			if(cer.price > min && cer.price < max){
				createOutput();
			}
		}
	}

	res.format({

		'text/html': () => {
			res.render('displayCerealsView', {title:"List of Cereals", 
				totalCount: count, data:results});
		},

		'application/json': () => {
			let newResults = (JSON.stringify(results, null, 4));
			res.send(newResults);
		},

		'application/xml': () => {
			let resultXml = '<?xml version="1.0"?>\n';
	
			for(let i=0; i<results.length; i++){
				let cereal = results[i];
				resultXml = resultXml + '<cereal>\n' +
					'   <id>' + cereal.id + "</id>\n" +
					'   <name>' + cereal.name + "</name>\n" +
					'   <company>' + cereal.company + "</company>\n" +
					'   <description>' + cereal.description + "</description>\n" +
					'   <price>' + cereal.price + "</price>\n" +
					'   <quantity>' + cereal.quantity + "</quantity>\n" +
					'</cereal>\n';
			}
				
			res.type('application/xml');
			res.send(resultXml);
		},

		'default': () => {
			res.status(404);
			res.send("<b>404 - Not Found</b>");
		}

	})

} catch(e){
	console.log(e);
}
};


// Display cereals
module.exports.displayCereals = async (req , res , next) => {

try{

	let cereals = await Cereal.find({});
	let results;

		results = cereals.map( cer => {
			return {
				id: cer._id,
				name: cer.name,
				company: cer.company,
				description: cer.description,
				price: orderModule.formatNum(cer.price),
				quantity: cer.quantity,
			}
		});

	var count = 0;

	for(var i=0; i<cereals.length; i++){
		count += cereals[i].quantity;
	}

	res.format({

		'text/html': () => {
			res.render('displayCerealsView', {title:"List of Cereals", 
			totalCount: count, data:results});
		},

		'application/json': () => {
			let newResults = (JSON.stringify(results, null, 4));
			res.send(newResults);
		},

		'application/xml': () => {

			let resultXml = '<?xml version="1.0"?>\n';
	
			for(let i=0; i<cereals.length; i++){
				let cereal = cereals[i];
				resultXml = resultXml + '<cereal>\n' +
					'   <id>' + cereal._id + "</id>\n" +
					'   <name>' + cereal.name + "</name>\n" +
					'   <company>' + cereal.company + "</company>\n" +
					'   <description>' + cereal.description + "</description>\n" +
					'   <price>' + cereal.price + "</price>\n" +
					'   <quantity>' + cereal.quantity + "</quantity>\n" +
					'</cereal>\n';
			}
				
			res.type('application/xml');
			res.send(resultXml);
		},

		'default': () => {
			res.status(404);
			res.send("<b>404 - Not Found</b>");
		}

	});

} catch(e){
	console.log(e);
}

};

// Edit cereal
module.exports.editCereal = async (req , res , next) => {

try{

    // Fill in the code
    let id = req.params.id;

	    let cereal = await Cereal.findById(id);

		if (!cereal){
			res.render('404');
	   	}
	    
	    else {
		      	res.render('editCerealView',
		        {title:'Editing', 
		        	data: {
					id: cereal._id,
					name: cereal.name,
					company: cereal.company,
					description: cereal.description,
					price: orderModule.formatNum(cereal.price),
					quantity: cereal.quantity
		            }
		       	});                
	    }

} catch(e){
	console.log(e);
}

};

// Save After Edit
module.exports.saveAfterEdit = async (req , res , next) => {

try{

    let id = req.body.id;
	let cereal = await Cereal.findById(id);

	    if (!cereal) {
	     		res.render('404', {title:'There was a Problem (404)'});
	    } 
		 
		else {


			if(isNaN(req.body.cprice)){
				
				res.render('404', {
					title: 'Not a Number',
					name: 'Invalid input: Price must be an integer or decimal.'
				})
			}

			else if(isNaN(req.body.cquan)){
				res.render('404', {
					title: 'Not a Number',
					name: 'Invalid input: Quantity must be a number.'
				})
			}
				
			else {

				let cName = req.body.cname.toUpperCase();
				let cCom = req.body.ccomp.toUpperCase();
				let cDes = req.body.cdes.toUpperCase();
				let cPri = req.body.cprice;
		
				cereal.name = cName;
				cereal.company = cCom;
				cereal.description = cDes;
				cereal.price = cPri;
				cereal.quantity = Math.floor((parseInt(req.body.cquan)));
				
				await cereal.save();

				// if save successful, update orders containing this cereal ID
				orderModule.updateItemsInOrder(id, cName, cCom, cDes, cPri);

				res.redirect('/admin');
			}	
	     }
    
} catch(e){
	console.log(e);
} 
};



 // Save cereal
 module.exports.saveCereal = async (req , res , next) => {

	try{
 
	// Fill in the code
	if (req.body.cname && req.body.ccomp && req.body.cdes && req.body.cprice && req.body.cquan){
	  let cereal = new Cereal({
		name:			req.body.cname.toUpperCase(),
		company:		req.body.ccomp.toUpperCase(),
		description: 	req.body.cdes.toUpperCase(),
		price: 			req.body.cprice.toUpperCase(),
		quantity:		req.body.cquan.toUpperCase()
	  }); 
	  
	await cereal.save((err) => {
	  if(err)
		console.log("Error : %s ",err);
		res.redirect('/admin');
	});
  
	}

	}catch (e) {
		console.log(e);
	}
  };




   // Delete customer
module.exports.deleteCustomer = async (req , res , next) => {

try{
    
    // Fill in the code
    let id = req.params.id;
	    
	let customer = await Customer.findById(id);

	if (!customer) {
	    res.render('404');
	} else {
			res.render('deleteCustomerView', {
			role:'admin',
			title:'Delete Customer and All Associated Orders?',
			data: {
				fName: customer.fName,
				lName: customer.lName,
				id: customer.id}
			})
	}

} catch(e){
	console.log(e);
}  

};

// Delete customer After Confirm
module.exports.deleteCustomerAfterConfirm = async (req , res , next) => {

try{
    
    // Fill in the code
    let cid = req.body.id;
	let orders = await Order.find({});

	for(let i=0; i<orders.length; i++){
		let order = orders[i];
		if (order.cust_id == cid){
			//await order.remove();
			await order.deleteOne();
		} 
	}
	    
	let customer = await Customer.findById(cid);

	if (!customer) {
	    res.render('404', {title: 'There was a problem (404)'});
	} else {
	    //await customer.remove();
		await customer.deleteOne();
	    res.redirect('/admin/customers');
	}

} catch(e){
	console.log(e);
}
       
};

// Display One Customer
module.exports.displaySingleCustomer = async (req , res , next) => {

try{	

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
			role:"admin",
			orderNum:order
		}
	});

	res.render('displaySingleCustomerView',
			{title:"Customer Information", data:results, id:id,
			editCall:"Edit Customer", deleteCall:"Delete Account",
			orderData:orderArray, role:'admin'});

} catch(e){
	console.log(e);
}
};

// Edit customer
module.exports.editCustomer = async (req , res , next) => {

try{

    let id = req.params.id;

	    let customer = await Customer.findById(id);
	     
	     if (!customer){
	     		 res.render('404');
	     	}
	      else {
		      	res.render('editCustomerView',
		        {title:'Editing', role:"admin",
		        	data: {
					id: customer._id,
					fName: customer.fName,
					lName: customer.lName,
		            }
		       	});                
	      }
 
} catch(e){
	console.log(e);
}
};


// Save After Edit
module.exports.saveCustAfterEdit = async (req , res , next) => {

try{

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

	        res.redirect('/admin/displaySingleCustomer/' + cid);
	     }
} catch(e){
	console.log(e);
}
};

module.exports.confirmOrder = async (req , res , next) => {

try{

	id = req.params.id;
	let order = await Order.findById(id);

	res.render('confirmOrderView', {
		title: "Order Completed",
		action:'/order',
		button:'Orders',
		orderdata: {
			id: order._id,
			cust_id: order.cust_id,
			cust_fname: order.cust_fname,
			cust_lname: order.cust_lname,
			items: order.items,
			numItems: order.numItems,
			totalCost: orderModule.formatNum(order.totalCost)}
	});

} catch(e){
	console.log(e);
}
};


// Delete order
module.exports.deleteOrder = async (req , res , next) => {

try{
    
    let id = req.params.id;
	    
	let order = await Order.findById(id);

	if (!order) {
	    res.render('404');
	} else {
	    res.render('deleteOrderView', {
        title:'Delete This Order?', post:'/admin/deleteorder/',
        data: {
            id: order._id,
			cid: order.cust_id,
			fName: order.cust_fname,
			lName: order.cust_lname,
            numItems: order.numItems,
			totalCost: orderModule.formatNum(order.totalCost)}
        })
	    } 
} catch(e){
	console.log(e);
}  
};

// Delete customer After Confirm
module.exports.deleteOrderAfterConfirm = async (req , res , next) => {

try{
    
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
			//await order.remove();
			await order.deleteOne();
			res.redirect('/admin/customers');
			//res.redirect('/admin/displaySingleCustomer/' + cid);

		}
} catch(e){
	console.log(e);
}		   
};



module.exports.editOrder = async (req , res , next) => {

try{	

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
						price: orderModule.formatNum(element.price),
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
						price: orderModule.formatNum(cer.price),
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
					{title:'Editing Order', role:'admin',
					message:"This is a New Order - Add Items.",
					
					orderdata: {
						id: order._id,
						cust_id: order.cust_id,
						cust_fname: order.cust_fname,
						cust_lname: order.cust_lname,
						items: order.items,
						numItems: order.numItems,
						totalCost: orderModule.formatNum(order.totalCost)
						},
	
						data: results, items
					   });                
			  }
} catch(e){
	console.log(e);
}
};

	// Save Order After Edit
module.exports.saveOrderAfterEdit = async (req , res , next) => {

try{	

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
			res.redirect('/admin/confirmOrder/' + order._id);
	     	}
} catch(e){
	console.log(e);
}			 
};

	