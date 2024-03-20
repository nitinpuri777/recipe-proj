import * as cheerio from 'cheerio';
const Scraper = {
getName: async (url) => {
        // let url = "https://thedefineddish.com/ginger-peanut-butter-ground-turkey-stir-fry/";
        let response = await fetch(url)
        let html = await response.text()
        const $ = cheerio.load(html);
        let name = $('.entry-title').text()
        return name
    },
    
getIngredients: async (url) => {
    // let url = "https://thedefineddish.com/ginger-peanut-butter-ground-turkey-stir-fry/";
    let response = await fetch(url)
    let html = await response.text()
    const $ = cheerio.load(html);
    let recipeGroups = $('.wprm-recipe-ingredient-group')
    let lineItems = recipeGroups.find('li').toArray()
    let toText = (item) => $(item).text()
    let listOfStrings = lineItems.map(toText)
    let trimFirstTwoCharacters = (string) => string.slice(2)
    let listOfCleanStrings = listOfStrings.map(trimFirstTwoCharacters)
    
    let ingredients = JSON.stringify(listOfCleanStrings) 
    return listOfCleanStrings
},

getRecipeSteps: async (url) => {
    let response = await fetch(url)
    let html = await response.text()
    const $ = cheerio.load(html);
    let recipeGroups = $('.wprm-recipe-instructions')
    let lineItems = recipeGroups.find('li').toArray()
    let toText = (item) => $(item).text()
    let listOfCleanStrings = lineItems.map(toText)
    return listOfCleanStrings
},

getRecipe: async function(url) {
    let scrapedIngredients = await this.getIngredients(url)
    let scrapedSteps = await this.getRecipeSteps(url)
    let scrapedName = await this.getName(url)
    const recipe = {
        name: scrapedName,
        ingredients: scrapedIngredients,
        steps: scrapedSteps
    }
    return recipe


}

}

export default Scraper