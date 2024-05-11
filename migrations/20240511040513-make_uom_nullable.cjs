'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Make "unitOfMeasure" column nullable in the "list_items" table
    await queryInterface.changeColumn('list_items', 'unitOfMeasure', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Make "quantity" column nullable in the "list_items" table
    await queryInterface.changeColumn('list_items', 'quantity', {
      type: Sequelize.INTEGER, // Assuming the type is INTEGER, adjust if different
      allowNull: true
    });

    // Add a nullable "name" column to the "lists" table
    await queryInterface.addColumn('lists', 'name', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert "unitOfMeasure" column to not nullable in the "list_items" table (if it was previously not nullable)
    await queryInterface.changeColumn('list_items', 'unitOfMeasure', {
      type: Sequelize.STRING,
      allowNull: false // Assuming it was not nullable before
    });

    // Revert "quantity" column to not nullable in the "list_items" table (if it was previously not nullable)
    await queryInterface.changeColumn('list_items', 'quantity', {
      type: Sequelize.INTEGER, // Assuming the type is INTEGER, adjust if different
      allowNull: false // Assuming it was not nullable before
    });

    // Remove the "name" column from the "lists" table
    await queryInterface.removeColumn('lists', 'name');
  }
};
