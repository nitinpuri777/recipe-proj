'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('meal_plans', 'meal_time', {
      type: Sequelize.ENUM('breakfast', 'lunch', 'dinner', 'snack'),
      allowNull: true
    });

    await queryInterface.changeColumn('meal_plans', 'servings', {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('meal_plans', 'meal_time', {
      type: Sequelize.ENUM('breakfast', 'lunch', 'dinner', 'snack'),
      allowNull: false
    });

    await queryInterface.changeColumn('meal_plans', 'servings', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: false
    });
  }
}; 