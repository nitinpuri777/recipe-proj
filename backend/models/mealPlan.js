import { Model, DataTypes } from 'sequelize';

class MealPlan extends Model {
  static initModel(sequelize) {
    MealPlan.init({
      meal_plan_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      recipe_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      meal_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      meal_time: {
        type: DataTypes.ENUM('breakfast', 'lunch', 'dinner', 'snack'),
        allowNull: false
      },
      servings: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      }
    }, {
      sequelize,
      modelName: 'mealPlan',
      tableName: 'meal_plans'
    });
  }

  static async createMealPlan(data) {
    return await MealPlan.create(data);
  }

  static async updateMealPlan(id, data) {
    const mealPlan = await MealPlan.findByPk(id);
    if (mealPlan) {
      return await mealPlan.update(data);
    }
    throw new Error('MEAL_PLAN_NOT_FOUND');
  }

  static async deleteMealPlan(id) {
    const mealPlan = await MealPlan.findByPk(id);
    if (mealPlan) {
      await mealPlan.destroy();
      return true;
    }
    throw new Error('MEAL_PLAN_NOT_FOUND');
  }
}

export default MealPlan; 