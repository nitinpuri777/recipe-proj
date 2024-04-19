import { Model } from 'sequelize'
import parseIngredients from './parseIngredients.js'

class Recipe extends Model {
  static async findAllForUser(user) {
      return await Recipe.findAll({
        where: {
          userId: user.id
        }
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
      try {
        const createdRecipe = await Recipe.create(newRecipe);
    } catch (error) {
        console.error("Failed to create recipe", error);
    }
      return await Recipe.findAllForUser(user)
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