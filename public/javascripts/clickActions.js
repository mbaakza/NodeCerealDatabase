function addCereal(){window.location.href = '/admin/addcereal';}
function cancelAddCer(){window.location.href = '/admin';}
function cancelDelete(){window.location.href = '/admin';}

function addCustomer(){window.location.href = '/customer/addcustomer';}

function cancelAddCust(){window.history.back();}

function goHome(cid){window.location.href = '/customer';}

function cancelDeleteCust(cid){window.history.back();}


function addOrder(){window.location.href = '/order/addorder';}
function cancelAddOrder(){window.history.back();}
function cancelDeleteOrder(){window.history.back();}

function goBack(oid){window.location.href = '/order/editorder/' + oid;}
function customerPage(cid){window.location.href = '/customer/displaySingleCustomer/' + cid;}
function goHome(){window.location.href = '/';}
function clearSearch(){window.location.href = '/admin/cereals';}