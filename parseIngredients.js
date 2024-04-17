import { parse } from "recipe-ingredient-parser-v3";

const ingredients = [
  // "⅓ cup heavy cream"
  // ,"½ teaspoon black pepper"
  // ,"½ teaspoon dried thyme"
  // ,"2  bay leaves"
  // ,"2 teaspoons kosher salt"
  // ,"1 cup frozen peas"
  // ,"4 cups cooked chicken (diced small)"
  // ,"3 tablespoons minced parsley"
  // ,"2 cups all-purpose flour"
  // ,"1 tablespoon baking powder"
  // ,"1 teaspoon salt"
  // ,"2 tablespoons unsalted butter (melted)"
  // ,"1 cup milk"
  // ,"Salt and black pepper"
  // ,"1 pound spaghetti"
  // ,"12 ounces boneless, skinless chicken breasts (about 2 medium), sliced into 1/2-inch-thick strips"
  // ,"2 tablespoons Worcestershire sauce"
  // ,"2 tablespoons extra-virgin olive oil"
  // ,"4 garlic cloves, finely chopped"
  // ,"3/4 teaspoon Italian seasoning "
  // ,"1/2 teaspoon crushed red pepper (optional)"
  // ,"1 pound sliced white or baby bella mushrooms"
  // ,"3/4 cup chicken broth"
  // ,"8 ounces shredded mozzarella"
  // ,"Beetles "
  // ,"Mayonnaise"
  // ,"Limoncello "
  // ,"Salt"
  // ,"4 cups milk, preferably whole milk"
  // ,"4 tablespoons butter"
  // ,"3 tablespoons all-purpose flour"
  // ,"1 pound macaroni"
  // ,"1 pound cheese (all Cheddar or at least half Cheddar and a mix of American, Swiss, Gruyère, Monterey Jack or any other cheese), grated or pre-shredded"
  // ,"Freshly grated nutmeg and/or freshly ground black pepper (optional)"
  // ,"12 ounces linguine pasta ((sub gluten-free pasta))"
  // ,"3  whole eggs"
  // ,"3  egg yolks"
  // ,"3/4 cup grated pecorino romano cheese, (plus more for serving)"
  // ,"2 tablespoon finely chopped parsley, (plus more for serving)"
  // ,"1/2 teaspoon kosher salt"
  // ,"1 teaspoon freshly ground black pepper, (plus more for serving)"
  // ,"1/2 lb pancetta, (cut into 1/4 inch cubes)"
  // ,"1  bunch asparagus, (woody ends removed and cut into 2 inch pieces)"
  // ,"3/4 cup green onions, (sliced)"
  // ,"3  garlic cloves, (minced)"
  // ,"8 ounces fresh English peas  ((frozen okay))"
  // ,"4 tablespoons extra-virgin olive oil"
  // ,"5 tablespoons unsalted butter, divided"
  // ,"3 medium yellow onions, chopped (about 3&frac12; cups)"
  // ,"3 large garlic cloves, minced"
  // ,"&frac14; cup all purpose flour"
  // ,"6 cups chicken broth"
  // ,"2  (28-ounce) cans whole peeled tomatoes"
  // ,"2 tablespoons sugar"
  // ,"&frac12; teaspoon dried thyme"
  // ," Salt"
  // ," Freshly ground black pepper"
  // ," Fresh chopped basil"
  // ," Croutons "
  // ," Freshly grated Parmigiano-Reggiano"
  // ,"2 tbsp avocado oil"
  // ,"1  large shallot (finely diced)"
  // ,"2 cloves garlic (minced)"
  // ,"1 inch knob ginger (peeled and finely grated)"
  // ,"2 pounds ground turkey (preferably dark meat)"
  ,"1½ teaspoon kosher salt"
  // ,"½ teaspoon pepper"
  // ,"2 tbsp creamy peanut butter or almond butter (*use unsweetened Almond butter to keep Whole30)"
  // ,"2 tbsp coconut aminos"
  // ,"1 tbsp rice vinegar"
  // ,"½ tsp toasted sesame oil"
  // ,"2 tbsp lime juice"
  // ,"2 tbsp sriracha"
  // ,"4  green onions (thinly sliced (white and green parts))"
  // ,"Steamed White Rice (*Use Cauliflower Rice for Whole30)"
  // ,"Fresh Mint Leaves"
  // ,"Fresh Thai Basil Leaves"
  // ,"Fresh Cilantro Leaves"
  // ,"4 6-ounce salmon fillets"
  // ,"1 tablespoon olive oil"
  // ,"1 teaspoon garlic powder"
  ,"1½ teaspoon paprika"
  // ,"Salt and pepper ( to taste)"
  // ,"Lemon wedges (for serving)"
  // ,"Tartar sauce (for serving)"
];

const parsedIngredients = []

function parseIngredients(ingredients) {
  ingredients.forEach(ingredient => {
    //console.log(ingredient)
    try {
      let parsedIngredient = parse(ingredient, 'eng')
      console.log(ingredient)
      console.log(parsedIngredient)
      parsedIngredients.push(parsedIngredient)
    } catch (error) {
      let parsedIngredient = `Error: `+ ingredient
      parsedIngredients.push(parsedIngredient)
    }
    
    
  })
}

//console.log(parsedIngredients)

parseIngredients(ingredients);