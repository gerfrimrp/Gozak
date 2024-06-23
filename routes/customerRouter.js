const { customerView, carForm, postCarForm, rideForm, postRideForm, customerOrders, historyOrder, cancelOrders, profilecCustomer } = require('../controllers/UserController');
const router = require('express').Router();
const { isloggedIn, isCustomer } = require('./middleware');

router.get('/:userid', isloggedIn, isCustomer, customerView);
router.get('/:userid/formOrderCarzak', isloggedIn, isCustomer, carForm);
router.post('/:userid/formOrderCarzak', isloggedIn, isCustomer, postCarForm);
router.get('/:userid/formOrderRidezak', isloggedIn, isCustomer, rideForm);
router.post('/:userid/formOrderRidezak', isloggedIn, isCustomer, postRideForm);
router.get('/:userid/orders', isloggedIn, isCustomer, customerOrders);
router.get('/:userid/history', isloggedIn, isCustomer, historyOrder);
router.get('/:userid/delete/:orderid', isloggedIn, isCustomer, cancelOrders);
router.get('/:userid/profile', profilecCustomer);

module.exports = router;