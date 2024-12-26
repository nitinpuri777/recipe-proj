import Recipe from "../models/recipe.js"

export const get = async (req, res) => { 
  try {
    console.log('Fetching recipes for user:', req.user.id);
    let recipes = await Recipe.findAllForUser(req.user);
    console.log('Recipes fetched successfully:', recipes);
    return res.status(200).json({ recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return res.status(400).json({ error });
  }
}
export const find = async (req, res) => { 
  try {
          let userId = req.user.id
          let recipeId = parseInt(req.params.id)
          let recipe = await Recipe.findRecipe(recipeId, userId)
          return res.status(200).json({recipe})
      
  } catch (error) {
      //Should try to figure out how to get middleware error handling working
      return res.status(400).json({error})
  }
}

export const post = async (req, res) => {
  let user = req.user
  let createdRecipe = await Recipe.addRecipe(user, req.body.recipe)
  return res.status(200).json({createdRecipe})
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
  put,
  find
}

export default ApiRecipes
