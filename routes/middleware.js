module.exports = {
    isloggedIn(req, res, next) {
        if (!req.session.userId) {
            const error = `Please login first`;
            res.redirect(`./login?error=${error}`);
        } else {
            next();
        };
    },

    isDriver(req, res, next) {
        if (req.session.userId && req.session.role !== 'Driver') {
            const error = `You Have No Access`;
            res.redirect(`./login?error=${error}`);
        } else {
            next();
        };
    },

    isCustomer(req, res, next) {
        if (req.session.userId && req.session.role !== 'Customer') {
            const error = `You Have No Access`;
            res.redirect(`./login?error=${error}`);
        } else {
            next();
        };
    },
}
