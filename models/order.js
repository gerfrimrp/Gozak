'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, { foreignKey: 'CustomerId' })
      Order.belongsTo(models.Service, { foreignKey: 'ServiceId' })
      // models.User.belongsToMany(models.Service, { through: Order /* options */ });
    }

    static filterBy(filter, Service, CustomerId) {
      let option = {
        include: [{
          model: Service,
        }],
        where: {
          CustomerId
        }
      }
      if (filter == 'Status') {
        option.order = [[
          'Status', 'DESC'
        ]]
      } else if (filter == 'orderDate') {
        option.order = [[
          'orderDate', 'DESC'
        ]]
      }
      return Order.findAll(option);
    }

    // get service() {
    //   if (this.ServiceId == 2) {
    //     return `RideZak`;
    //   } else if (this.ServiceId == 1) {
    //     return `CarZak`;
    //   };
    // };

    // get ongkos() {
    //   let number = this.destination.length;
    //   if (this.ServiceId == 2) {
    //     return number * 5000
    //   } else if (this.ServiceId == 1) {
    //     return number * 10000
    //   }
    // }


    get getOrderDate() {
      let date = this.orderDate
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      return formattedDate;
    }
  }
  Order.init({
    orderDate: DataTypes.DATE,
    destination: DataTypes.STRING,
    ServiceId: DataTypes.INTEGER,
    DriverId: DataTypes.INTEGER,
    CustomerId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    Status: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Order',
    hooks: {
      beforeCreate: (instance) => {
        instance.Status = 'Menunggu Driver'
      }
    }
  });
  return Order;
};