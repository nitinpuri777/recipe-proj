import * as cheerio from 'cheerio';
import { parseHostname } from '../../frontend/globals.js';
import parseIngredients from './parseIngredients.js';
const Scraper = {
getRecipe: async function(url) {
    let recipeContent = await this.findRecipe(url)
    let scrapedImageUrl = this.scrapeImageUrl(recipeContent)
    let scrapedName = this.scrapeName(recipeContent)
    let scrapedIngredients = this.scrapeIngredients(recipeContent)
    let scrapedSteps = this.scrapeSteps(recipeContent)
    let hostname = parseHostname(url)
    let serving_size = this.scrapeServingSize(recipeContent)
    const recipe = {
        name: scrapedName,
        ingredients: scrapedIngredients,
        steps: scrapedSteps,
        image_url: scrapedImageUrl,
        hostname,
        url: url,
        ld_json: recipeContent,
        serving_size,
        
    }
    recipe.parsedIngredients = parseIngredients(recipe.ingredients)

    return recipe


},
findRecipe: async function(url) {
    let response = await fetch(url)
    let html = await response.text()
    const $ = cheerio.load(html);
    const linkedDataCheerioObject = $('script[type="application/ld+json"]')
    const  linkedDataObjects= [];
    //It's possible that a page has more than one ld+json defined so iterate to capture all
    linkedDataCheerioObject.each((index, element) => {
        const content = $(element).html();
        if (content) {
            linkedDataObjects.push(JSON.parse(content));
        }
    })
    //iterate through all and call search to find the @type='Recipe' object
    for (const obj of linkedDataObjects) {
        let recipe = this.searchForRecipeObject(obj)
        if (recipe) {
            return recipe;
        }
    }
    return null;
    
},

searchForRecipeObject: function(content){ 
    //if content is null, undefined, or not an object that we can parse return null
    if (!content || typeof content !== 'object') {
        return null;
    }
    //if the content passed has key @type or type where value is 'Recipe' then return this content, it's the recipe!
    if (content['@type'] === 'Recipe' || content['type'] === 'Recipe') {
        return content;
    }
    //if content has key @type but refers to multiple types check if one of the types is Recipe
    if (Array.isArray(content['@type'])) {
        if(content['@type'].includes("Recipe")) {
            return content
        }
    }

    //otherwise let's iterate through each property in content and call this function recursively to see if those refer to object we want
    for (const key in content) {
        //if the property refers to an array, then let's run every item of the array through this function
        if(Array.isArray(content[key])){
            for(const item of content[key]) { 
                const recipe = this.searchForRecipeObject(item)
                if(recipe) {
                    return recipe;
                }
            }
        }
        //otherwise simply run the value of this property through the function
        else {
            const recipe = this.searchForRecipeObject(content[key])
            if(recipe) {
                return recipe;
            }
        }
    }
    return null;
},
findFirstImageString(obj) {
    // Define the common image file extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
  
    // Helper function to check if a string ends with any of the image extensions
    function isImageString(str) {
      return imageExtensions.some(extension => str.endsWith(extension));
    }
  
    // Recursive function to search for image string
    function search(obj) {
      // Iterate over the object's properties
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
  
          // Check if the property value is a string and if it references an image
          if (typeof value === 'string' && isImageString(value)) {
            return value; // Return the first image string found
          } else if (typeof value === 'object' && value !== null) {
            // If the property is an object, recurse into it
            const result = search(value);
            if (result) return result; // Return the found image string, if any
          }
        }
      }
      // Return null if no image string is found in the current object
      return null;
    }
  
    // Start the search from the root object
    return search(obj);
  },

parseRecipeObject: async function(url) {
    let response = await fetch(url)
    let html = await response.text()
    const $ = cheerio.load(html);
    const ldJsons = $('script[type="application/ld+json"]')
    const jsonValues = [];
    ldJsons.each((index, element) => {
        const content = $(element).html();
        if (content) {
            jsonValues.push(JSON.parse(content));
        }
    });
    let recipe = {}
    jsonValues.some(object => {
        if(object['@graph']){
            object['@graph'].some(internalObject => {
                if(internalObject['@type'] === 'Recipe') {
                    recipe = internalObject
                    return true
                }
            })
        }
    })
    return recipe
},

scrapeName: function(recipe) {
    if (recipe['name']){
        return recipe['name']
    }
    else {
        return "Unnamed Recipe"
    }
},

scrapeIngredients: function(recipe) {
    if (recipe['recipeIngredient']){
        return recipe['recipeIngredient']
    }
    else {
        return ['No ingredients found']
    }
},
scrapeSteps: function(recipe) {
    let recipeSteps = []
    if (recipe['recipeInstructions']){
        recipe['recipeInstructions'].forEach(instruction => {
            if(instruction['@type'] === 'HowToStep'){
                recipeSteps.push(instruction['text'])
            }
            if(instruction['@type']=== 'HowToSection'){
                instruction['itemListElement'].forEach(item => {
                    if(item['@type'] === 'HowToStep'){
                        recipeSteps.push(item['text'])
                    }
                })
            }

        })
    }
    else {
        recipeSteps = ['No ingredients found']
    }
    return recipeSteps
},
scrapeImageUrl: function(recipe) {
    return this.findFirstImageString(recipe)
},
scrapeServingSize: function(recipe) {
    // Check if recipeYield exists
    if (recipe.recipeYield) {
        // Determine if recipeYield is an array or a string
        let yieldValue = Array.isArray(recipe.recipeYield) ? recipe.recipeYield[0] : recipe.recipeYield;
        // Use regex to find the first sequence of digits
        let match = yieldValue.match(/\d+/);
        // Parse the found digits to an integer and return, or return null if no digits found
        return match ? parseInt(match[0]) : null;
    }
    return null; // Return null if no recipeYield is present
}



}

export default Scraper