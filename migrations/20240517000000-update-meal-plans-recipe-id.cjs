'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('meal_plans', 'recipe_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'recipes',
        key: 'id'
      },
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('meal_plans', 'recipe_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'recipes',
        key: 'id'
      },
      onDelete: 'CASCADE'
    });
  }
}; 