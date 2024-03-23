import * as cheerio from 'cheerio';
const Scraper = {
getRecipe: async function(url) {
    let recipeContent = await this.findRecipe(url)
    console.log(`Recipe Object ${recipeContent}`)
    let parsedName = this.parseName(recipeContent)
    console.log(parsedName)
    let parsedIngredients = this.parseIngredients(recipeContent)
    console.log(parsedIngredients)
    let parsedSteps = this.parseSteps(recipeContent)
    console.log(parsedSteps)
    const recipe = {
        name: parsedName,
        ingredients: parsedIngredients,
        steps: parsedSteps
    }
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

parseRecipeObject: async function(url) {
    let response = await fetch(url)
    let html = await response.text()
    const $ = cheerio.load(html);
    const ldJsons = $('script[type="application/ld+json"]')
    const jsonValues = [];
    ldJsons.each((index, element) => {
        const content = $(element).html();
        if (content) {
            console.log(`content: ${content}`)
            jsonValues.push(JSON.parse(content));
        }
    });
    console.log(`JsonValues: ${jsonValues}`)
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

parseName: function(recipe) {
    if (recipe['name']){
        return recipe['name']
    }
    else {
        return "Unnamed Recipe"
    }
},

parseIngredients: function(recipe) {
    if (recipe['recipeIngredient']){
        return recipe['recipeIngredient']
    }
    else {
        return ['No ingredients found']
    }
},
parseSteps: function(recipe) {
    let recipeSteps = []
    if (recipe['recipeInstructions']){
        recipe['recipeInstructions'].forEach(step => {
            if(step['@type'] === 'HowToStep'){
                recipeSteps.push(step['text'])
            }
        })
    }
    else {
        recipeSteps = ['No ingredients found']
    }
    return recipeSteps
}

}

export default Scraper