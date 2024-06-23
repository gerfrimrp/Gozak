const { home, registerForm, postRegister, loginForm, postLogin, logOut } = require('../controllers/UserController');
const router = require('express').Router();
const customerRouter = require('./customerRouter');
const driverRouter = require('./driverRoutes');

router.get('/', home);
router.get('/register', registerForm);
router.post('/register', postRegister);
router.get('/login', loginForm);
router.post('/login', postLogin);


router.use(function (req, res, next) {
    // console.log(req.session)
    if (!req.session.userId) {
        const error = `Please login first`
        res.redirect(`./login?error=${error}`)
    } else {
        next()
    }
})

router.use('/customerView', customerRouter);
router.use('/driverView', driverRouter);

router.get('/logout', logOut)

module.exports = router;