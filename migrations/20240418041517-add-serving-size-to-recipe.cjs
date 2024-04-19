'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('recipes','serving_size', {
      type: Sequelize.INTEGER,
      allowNull: true, // or false, depending on whether this field is required
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('recipes', 'serving_size');
  }
};
