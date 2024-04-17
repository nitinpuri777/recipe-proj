'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('recipes','ld_json', {
      type: Sequelize.JSON,
      allowNull: true, // or false, depending on whether this field is required
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('recipes', 'ld_json');
  }
};
