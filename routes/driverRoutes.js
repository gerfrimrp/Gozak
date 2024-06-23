const { driverView, tolakOrder, approvedOrder, profileDriver } = require('../controllers/DriverController');
const router = require('express').Router();
const { isloggedIn, isDriver } = require('./middleware');

router.get('/:userid', isloggedIn, isDriver, driverView);
router.get('/:userid/tolak/:orderid', isloggedIn, isDriver, tolakOrder);
router.get('/:userid/approved/:orderid', isloggedIn, isDriver, approvedOrder);
router.get('/:userid/profile', profileDriver);

module.exports = router;