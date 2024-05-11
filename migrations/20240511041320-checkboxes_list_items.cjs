'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add a "checked" boolean column to the "list_items" table
    await queryInterface.addColumn('list_items', 'checked', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the "checked" column from the "list_items" table
    await queryInterface.removeColumn('list_items', 'checked');
  }
};
