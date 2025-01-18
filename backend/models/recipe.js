import { Model, DataTypes } from 'sequelize'
import parseIngredients from './parseIngredients.js'

class Recipe extends Model {
  static initModel(sequelize) {
    Recipe.init({
      name: DataTypes.STRING,
      ingredients: DataTypes.JSON,
      steps: DataTypes.JSON,
      image_url: DataTypes.STRING,
      hostname: DataTypes.STRING,
      url: DataTypes.STRING,
      ld_json: DataTypes.JSON,
      serving_size: DataTypes.INTEGER,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Ensure this matches your users table name (might be 'Users')
          key: 'id',
        }
      }
    }, {
      sequelize,
      modelName: 'recipe'
    });
  }

  static async findAllForUser(user) {
      return await Recipe.findAll({
        where: {
          userId: user.id
        },
        order: [['createdAt', 'DESC']]
      })
  }
  static async findRecipe(recipeId, userId) {
    let foundRecipe = await Recipe.findOne({
      where: {
        id: recipeId,
        userId: userId
      }
    })
    if (foundRecipe){
      let parsedIngredients = parseIngredients(foundRecipe.ingredients)
      foundRecipe.dataValues.parsedIngredients = parsedIngredients
      console.log(foundRecipe)
      return foundRecipe
    }
    else {
      throw 'RECIPE_NOT_FOUND';
    }
  }

  

  static async addRecipe(user, recipe) {
      let userId = user.id
      let blankRecipeForUser = { userId }
      let newRecipe = {...blankRecipeForUser, ...recipe}
      let createdRecipe = null
      try {
        createdRecipe = await Recipe.create(newRecipe);
    } catch (error) {
        console.error("Failed to create recipe", error);
    }
      return createdRecipe
  }
  static async removeRecipe(user, recipeToRemoveId) {
      let recipeToRemove = await Recipe.findByPk(recipeToRemoveId)
      if(recipeToRemove) {
        await recipeToRemove.destroy()
      }
      return Recipe.findAllForUser(user)
  }

  static async updateRecipe(user, recipeId, recipeUpdate) {
    let recipeToUpdate = await Recipe.findByPk(recipeId)
    if(recipeToUpdate) {
      await recipeToUpdate.update(recipeUpdate)
    }
    return Recipe.findAllForUser(user)
  }
}

export default Recipe