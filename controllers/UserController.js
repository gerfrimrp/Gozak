
const { where, Model } = require('sequelize');
const { User, UserProfile, Order, Service } = require('../models');
const bcrypt = require('bcryptjs');
const { formatCurrency } = require('../helpers/formatCurrency');
const { splitStringToArray } = require('../helpers/filterInfo')
// const { ongkos } = require('../helpers/createFare');

module.exports = {
    async home(req, res) {
        try {
            res.render('LandingPage');
        } catch (err) {
            res.send(err);
        }
    },

    async registerForm(req, res) {
        try {
            const { emailError, error } = req.query;
            res.render('Register', { emailError, error, splitStringToArray });
        } catch (err) {
            res.send(err);
        }
    },

    async postRegister(req, res) {
        try {
            const { email, password, role, fullName, gender, phoneNumber, address } = req.body;
            const user = await User.findOne({
                where: {
                    email
                }
            });
            if (user) {
                const emailError = `Email already in use`
                return res.redirect(`./register?emailError=${emailError}`);
            };
            let cust = await User.create({ email, password, role });
            let profile = await UserProfile.create({ fullName, gender, phoneNumber, UserId: cust.id, address })
            if (!profile) {
                await User.destroy({
                    where: {
                        email
                    }
                });
            }
            res.redirect('/login')
        } catch (err) {
            if (err.name == 'SequelizeValidationError') {
                let error = err.errors.map((e) => {
                    console.log(e.message)
                    return e.message
                });
                res.redirect(`/register?error=${error}`)
            } else {
                res.send(err)
                console.log(err)
            }
        }
    },

    async loginForm(req, res) {
        try {
            const { error, emailError, passError } = req.query;
            res.render('Login', { error, emailError, passError });
        } catch (err) {
            res.send(err);
        }
    },

    async postLogin(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({
                where: {
                    email
                }
            });
            if (user) {
                const isValidPassword = bcrypt.compareSync(password, user.password);
                if (isValidPassword) {
                    req.session.userId = user.id;
                    req.session.role = user.role;

                    //farhan, buat misahin redirect sesuai role
                    if (user.role === 'Customer') {
                        // kalo misalkan role nya customer redirect ke view customer
                        return res.redirect(`/customerView/${user.id}`)
                    } else if (user.role === 'Driver') {
                        // kalo misalkan role nya Driver redirect ke view driver
                        return res.redirect(`/driverView/${user.id}`)
                    }

                } else {
                    const passError = `Invalid password`;
                    return res.redirect(`./login?passError=${passError}`);
                };
            } else {
                const emailError = `Invalid email`;
                return res.redirect(`./login?emailError=${emailError}`);
            };
        } catch (err) {
            res.send(err);
        }
    },

    async customerView(req, res) {
        try {
            const { userid } = req.params;
            const user = await UserProfile.findOne({
                include: User,
                where: {
                    UserId: userid
                }
            });
            res.render('CustomerView', { user, userid });
        } catch (err) {
            res.send(err);
        };
    },

    async carForm(req, res) {
        try {
            const { userid } = req.params;
            let driver = await User.findAll({
                include: UserProfile,
                where: {
                    role: 'Driver'
                },
            });
            res.render('formCarzak', { userid, driver });
        } catch (err) {
            res.send(err);
        };
    },

    async postCarForm(req, res) {
        try {
            const { destination, DriverId, description } = req.body;
            const { userid: CustomerId } = req.params;
            const { name } = req.query;
            async function ongkos(destination) {
                let number = destination.length;
                if (name == 'RideZak') {
                    return number * 5000;
                } else if (name == 'CarZak') {
                    return number * 10000;
                };
            };
            const fare = await ongkos(destination);
            const service = await Service.create({ name, fare, description });
            const ServiceId = service.id;
            let orderDate = new Date();
            await Order.create({ orderDate, destination, ServiceId, DriverId, CustomerId });
            res.redirect(`/customerView/${CustomerId}/orders`);
        } catch (err) {
            res.send(err);
        }
    },

    async rideForm(req, res) {
        try {
            const { userid } = req.params;
            let driver = await User.findAll({
                include: UserProfile,
                where: {
                    role: 'Driver'
                },
            });
            res.render('formRidezak', { userid, driver });
        } catch (err) {
            res.send(err);
        }
    },

    async postRideForm(req, res) {
        try {
            const { destination, DriverId } = req.body;
            const { userid: CustomerId } = req.params;
            const { id: ServiceId, name } = req.query;
            let orderDate = new Date();
            await Service.create({ name })
            let orderan = await Order.create({ orderDate, destination, ServiceId, DriverId, CustomerId });
            let user = await UserProfile.findByPk(CustomerId)
            res.redirect(`/customerView/${CustomerId}/orders`)
        } catch (err) {
            res.send(err);
            console.log(err)
        }
    },

    async customerOrders(req, res) {
        try {
            const { Status, destination } = req.query
            const { userid: CustomerId } = req.params;

            let data = await User.findAll({
                include: [{
                    model: Order,
                    include: [{
                        model: Service
                    }]
                }],
                where: {
                    id: CustomerId
                }
            });

            let driver = await User.findAll({
                include: UserProfile,
                where: {
                    role: 'Driver'
                },
            });
            console.log(driver.UserProfile, '<<<<<<<<')

            let userid = CustomerId
            res.render('orderCustomer', { destination, data, formatCurrency, userid, driver })
        } catch (err) {
            res.send(err);
        }
    },

    async cancelOrders(req, res) {
        try {
            const { orderid, userid: CustomerId } = req.params;
            let order = await Order.findByPk(orderid);
            await order.destroy();
            res.redirect(`/customerView/${CustomerId}/orders?destination=${order.destination}`)
        } catch (err) {
            res.send(err);
        }
    },

    async logOut(req, res) {
        try {
            req.session.destroy()
            res.redirect(`/login`)
        } catch (err) {
            res.send(err)
        }
    },

    async profilecCustomer(req, res) {
        let { userid } = req.params
        try {
            const profile = await User.findByPk(userid, {
                include: UserProfile
            })
            // res.send(profile)
            res.render('profileCustomer', { userid, profile })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    },

    async historyOrder(req, res) {
        try {
            const { filter } = req.query
            const { userid: CustomerId } = req.params;
            let data = await Order.filterBy(filter, Service, CustomerId);
            // console.log(data,'<<<<<<<<<<<<<<<')
            let userid = CustomerId
            res.render('HistoryOrder', { data, formatCurrency, userid })
        } catch (err) {
            res.send(err);
        }
    },
}