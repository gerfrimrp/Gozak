const { where, Model } = require('sequelize');
const { User, UserProfile, Order, Service } = require('../models');
const bcrypt = require('bcryptjs');
const { formatCurrency } = require('../helpers/formatCurrency');
const order = require('../models/order');
// const { ongkos } = require('../helpers/createFare');

module.exports = {

    async driverView(req, res) {
        try {
            const { userid: DriverId } = req.params;
            let data = await Order.findAll({
                include: Service,
                where: {
                    DriverId
                },
                order: [['Status', 'ASC']],
            });
            res.render('driverView', { data, DriverId, formatCurrency });
        } catch (err) {
            res.send(err);
        }
    },

    async tolakOrder(req, res) {
        try {
            const { orderid, userid: DriverId } = req.params;
            let order = await Order.findByPk(orderid);
            await order.update({
                Status: `Reject`
            });
            res.redirect(`/driverView/${DriverId}`)
        } catch (err) {
            res.send(err);
        }
    },

    async approvedOrder(req, res) {
        try {
            const { orderid, userid: DriverId } = req.params;
            let order = await Order.findByPk(orderid);
            await order.update({
                Status: `Sukses`
            });
            res.redirect(`/driverView/${DriverId}`)
        } catch (err) {
            res.send(err);
        }
    },

    async profileDriver(req, res) {
        let { userid } = req.params
        try {
            const profile = await User.findByPk(userid, {
                include: UserProfile
            })
            // res.send(profile)
            DriverId = userid
            res.render('profileDriver', { DriverId, profile })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }
}