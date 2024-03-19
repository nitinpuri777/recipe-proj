
import Recipe from "../models/recipe.js"

export const get = async (req, res) => { 
  try {
          let user = req.user
          let recipes = await Recipe.findAllForUser(user)
          return res.status(200).json({recipes})
      
  } catch (error) {
      return res.status(400).json({error})
  }
}
export const post = async (req, res) => {
  let user = req.user
  let recipes = await Recipe.addRecipe(user, req.body.recipe)
  return res.status(200).json({recipes})
}

export const delete_ = async (req, res) => {
  let recipeId = req.params.id
  let user = req.user
  let recipes = await Recipe.removeRecipe(user, recipeId)
  return res.status(200).json({recipes})
}

export const put = async (req, res) => {
  let recipeId = req.params.id
  let user = req.user
  let recipes = await Recipe.updateRecipe(user, recipeId, req.body.recipe)
  return res.status(200).json({recipes})
}

const ApiRecipes = {
  get,
  post,
  delete_,
  put
}

export default ApiRecipes
