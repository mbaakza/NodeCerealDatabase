const express = require('express');
const router = express.Router();

// All modules
const adminModule = require("./adminModule");
const customerModule = require("./customerModule");
const orderModule = require("./orderModule");

// Admin cereal assignments
const getRole	                          = adminModule.getRole;
const adisplaySingleCustomer	          = adminModule.displaySingleCustomer;
const adminHome 	                      = adminModule.adminHome; 
const displayCereals 	                  = adminModule.displayCereals; 
const searchCereals 	                  = adminModule.searchCereals; 
const saveAfterEdit                     = adminModule.saveAfterEdit;
const addCereal 			                  = adminModule.addCereal;
const saveCereal			                  = adminModule.saveCereal; 
const editCereal			                  = adminModule.editCereal; 
const deleteCereal 		                  = adminModule.deleteCereal; 
const deleteCerealAfterConfirm          = adminModule.deleteCerealAfterConfirm;
const adminDeleteCustomer 		          = adminModule.deleteCustomer; 
const adminDeleteCustomerAfterConfirm   = adminModule.deleteCustomerAfterConfirm;
const adminEditCustomer			            = adminModule.editCustomer; 
const adminSaveCustAfterEdit            = adminModule.saveCustAfterEdit;
const adminConfirmOrder                 = adminModule.confirmOrder;
const adminDeleteOrder                  = adminModule.deleteOrder; 
const adminDeleteOrderAfterConfirm      = adminModule.deleteOrderAfterConfirm;
const adminEditOrder			              = adminModule.editOrder; 
const adminSaveOrderAfterEdit           = adminModule.saveOrderAfterEdit;

// Customer assignments
const cdisplaySingleCustomer	          = customerModule.displaySingleCustomer;
const customerHome 	                    = customerModule.customerHome; 
const customerLogin 	                  = customerModule.customerLogin; 
const displayCustomers 	                = customerModule.displayCustomers;  
const addCustomer			                  = customerModule.addCustomer;
const saveCustomer			                = customerModule.saveCustomer; 
const editCustomer			                = customerModule.editCustomer; 
const saveCustAfterEdit                 = customerModule.saveCustAfterEdit;
const deleteCustomer 		                = customerModule.deleteCustomer; 
const deleteCustomerAfterConfirm        = customerModule.deleteCustomerAfterConfirm;
const customerConfirmOrder              = customerModule.confirmOrder;

// Order assignments
const displayOrders 	                  = orderModule.displayOrders; 
const addNewOrder			                  = orderModule.addNewOrder;
const saveNewOrder			                = orderModule.saveNewOrder; 
const saveOrderAfterReg		              = orderModule.saveOrderAfterReg; 
const editOrder			                    = orderModule.editOrder; 
const saveOrderAfterEdit                = orderModule.saveOrderAfterEdit;
const confirmOrder                      = orderModule.confirmOrder;
const deleteOrder                       = orderModule.deleteOrder; 
const deleteOrderAfterConfirm           = orderModule.deleteOrderAfterConfirm;

// router specs
router.get('/', (req, res, next) => {
  res.redirect('/welcome');
});

router.get('/welcome', 						                    getRole);

// Admin cereal routes
router.post('/admin', 						                    adminHome);
router.get('/admin', 						                      adminHome); 
router.get('/admin/cereals', 				                  displayCereals); 
router.post('/admin/searchCereals', 	                searchCereals);
router.get('/admin/searchCereals/query/:query',       searchCereals);
router.get('/admin/searchCereals/min/:min/max/:max',  searchCereals);
router.get('/admin/addcereal', 				                addCereal);
router.post('/admin/addcereal', 			                saveCereal);
router.get('/admin/editcereal/:id', 	                editCereal);
router.post('/admin/editcereal/', 	                  saveAfterEdit);
router.get('/admin/deletecereal/:id',                 deleteCereal);
router.post('/admin/deletecereal',                    deleteCerealAfterConfirm);
router.get('/admin/displaySingleCustomer/:id',        adisplaySingleCustomer);
router.get('/admin/deletecustomer/:id',               adminDeleteCustomer);
router.post('/admin/deletecustomer',                  adminDeleteCustomerAfterConfirm);
router.get('/admin/editcustomer/:id', 	              adminEditCustomer);
router.post('/admin/editcustomer/', 	                adminSaveCustAfterEdit);
router.get('/admin/deleteorder/:id',                  adminDeleteOrder);
router.post('/admin/deleteorder',                     adminDeleteOrderAfterConfirm);
router.get('/admin/editorder/:id', 	                  adminEditOrder);
router.get('/admin/confirmOrder/:id',                 adminConfirmOrder);
router.post('/admin/confirmOrder/',                   adminSaveOrderAfterEdit);

// Customer routes
router.get('/customer/show/:id', 						          customerHome);
router.post('/customer/welcomeback/', 				        customerLogin);
router.get('/admin/customers', 						            displayCustomers);
router.get('/customer/displaySingleCustomer/:id',     cdisplaySingleCustomer);
router.get('/customer/addcustomer', 	                addCustomer);
router.post('/customer/addcustomer', 	                saveCustomer);
router.get('/customer/editcustomer/:id', 	            editCustomer);
router.post('/customer/editcustomer/', 	              saveCustAfterEdit);
router.get('/customer/deletecustomer/:id',            deleteCustomer);
router.post('/customer/deletecustomer',               deleteCustomerAfterConfirm);

// Order routes
router.get('/order', 						                      displayOrders);
router.get('/order/addorder', 	                      confirmOrder);
router.post('/order/addorder', 	                      saveOrderAfterReg);
router.post('/order/addneworder', 	                  addNewOrder);
router.post('/order/saveneworder', 	                  saveNewOrder);
router.get('/order/editorder/:id', 	                  editOrder);
router.get('/order/confirmOrder/:id',                 confirmOrder);
router.post('/order/confirmOrder/',                   saveOrderAfterEdit);
router.get('/order/deleteorder/:id',                  deleteOrder);
router.post('/order/deleteorder',                     deleteOrderAfterConfirm);

module.exports = router;
