'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'stytchUserId', {
      type: Sequelize.STRING,
      allowNull: true, // or false, depending on your requirement
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'stytchUserId');
  }
};
