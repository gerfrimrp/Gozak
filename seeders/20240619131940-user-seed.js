'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcrypt = require('bcryptjs');
module.exports = {
  async up (queryInterface, Sequelize) {
    const user = require('../data/user.json').map((e) => {
      delete e.id;
      e.password = bcrypt.hashSync(e.password);
      e.createdAt = e.updatedAt = new Date();
      return e
    })
    // console.log(user)
    await queryInterface.bulkInsert('Users', user,{});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    });
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
