import { Model } from 'sequelize'
import { parse } from "recipe-ingredient-parser-v2";
import { parseIngredient } from 'parse-ingredient';

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
      let parsedIngredients = Recipe.parseIngredients(foundRecipe.ingredients)
      foundRecipe.dataValues.parsedIngredients = parsedIngredients
      console.log(foundRecipe)
      return foundRecipe
    }
    else {
      throw 'RECIPE_NOT_FOUND';
    }
  }

  static parseIngredients(ingredients) {
    let parsedIngredients = []
    ingredients.forEach(ingredient => {
      try {
        let parsedIngredient = parseIngredient(ingredient)[0]
        parsedIngredient.ingredientString = ingredient
        parsedIngredients.push(parsedIngredient)
      } catch (error) {
        let parsedIngredient = `Error: `+ ingredient
        parsedIngredients.push(parsedIngredient)
      }
      
      
      
    })
    return parsedIngredients
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