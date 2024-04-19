import { parseIngredient } from "parse-ingredient"
function parseIngredients(ingredients) {
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

export default parseIngredients