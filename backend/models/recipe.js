import database from '../database.js'
import User from './user.js'
const Recipe = {
  //findAllForUser: (user) => database.recipes.filter(recipe => recipe.userId === user.id)
  findAllForUser: async (user) => {
      let matchesUserId = recipe => recipe.userId === user.id
      return database.recipes.filter(matchesUserId)
  },
  addRecipe: async (user, recipe) => {
      let userId = await User.findId(user)
      let name = recipe.name
      let id = await Recipe.getMaxId() + 1
      let newRecipe = {
          id,
          name,
          userId
      }
      database.recipes.push(newRecipe)
      return Recipe.findAllForUser(user)
  },

  removeRecipe: async (user, recipeToRemoveId) => {
      let isRecipeToRemove = recipe => recipe.id == recipeToRemoveId
      const recipeIndexToRemove = database.recipes.findIndex(isRecipeToRemove)
      if(recipeIndexToRemove !== -1){
          database.recipes.splice(recipeIndexToRemove, 1);
      }
      return Recipe.findAllForUser(user)
  },

  updateRecipe: async (user, recipeId, recipeUpdate) => {
    let isRecipeToUpdate = recipe => recipe.id == recipeId
    const originalRecipe = database.recipes.find(isRecipeToUpdate)
    const originalRecipeIndex = database.recipes.findIndex(isRecipeToUpdate)
    if(originalRecipe){
      let updatedRecipe = {...originalRecipe, ...recipeUpdate}
      database.recipes[originalRecipeIndex] = updatedRecipe
    }
    else {
      return null
    }
    return Recipe.findAllForUser(user)
  },

  getMaxId: async () => {
      let getMax = (valueSoFar, recipe) => {
          return Math.max(valueSoFar, recipe.id)}
      return database.recipes.reduce(getMax, 0);
  }
      


  }

export default Recipe