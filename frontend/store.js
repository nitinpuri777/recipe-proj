import { defineStore } from 'pinia'
import router from './router.js'
import stytchClient from './components/auth/stytch-client.js'
import { parseHostname } from './globals.js'


export const useStore = defineStore('store', { 
  state() {
    return {
      showDelete: false,
      recipes: [],
      editRecipeId: null,
      overlayInput: {
        overlayType: "none",
        recipeNameInput: "",
        recipeIngredientsInput: [""],
        recipeStepsInput: [""],
        urlToScrapeInput: "",
        hostname: "",
        imageUrl: ""
        },
      recipeToDelete: {},
      recipeToView: {},
      isAuthenticated: stytchClient.session.getSync() ? true : false,
    }
  },
  getters: { 
    modalClasses() {
      if (this.showDelete) {
        return ""
      }
      else {
        return "modal--hidden"
      }
    },
    modalOverlayClasses() {
      if (this.showDelete) {
        return ""
      }
      else {
        return "modal_overlay--hidden"
      }
    },
  },
  actions: {
    async loadRecipes() { 
      this.recipes = await this.fetchRecipes()
    },
    async scrapeRecipe(scrapeUrl) {
      let url = '/api/scrape'
      let token = localStorage.getItem("authToken")
      let scrapeDetails = {
        url: scrapeUrl
      }
      let body = { scrapeDetails }
      let options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
      const response = await fetch(url, options)
      const json = await response.json()
      this.overlayInput.recipeIngredientsInput = json.recipe.ingredients
      this.overlayInput.recipeStepsInput = json.recipe.steps
      this.overlayInput.recipeNameInput = json.recipe.name
      this.overlayInput.imageUrl = json.recipe.image_url
      this.overlayInput.hostname = parseHostname(scrapeUrl)
      this.urlToScrapeInput = ""
      return json.recipe
    },
    goToApp() {
      router.push('/app')
    },
    async fetchRecipes() {
        let url = '/api/recipes'
        let options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
          }
        }
        const response = await fetch(url, options)
        const json = await response.json()
        return json.recipes
    },
    async fetchRecipe(recipeId) {
        let url = `/api/recipe/${recipeId}`
        let options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
          }
        }
        const response = await fetch(url, options)
        const json = await response.json()
        this.recipeToView = json.recipe
        return json.recipe
    },
    showDeleteConfirm(recipe) {
      this.showDelete = true
      this.recipeToDelete = recipe
    },
    hideDeleteConfirm() {
      this.showDelete = false
    },
    async deleteRecipe(recipe) {
      let url = `/api/recipes/${recipe.id}`
      let token = localStorage.getItem("authToken")
      let options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token} `
        }
      }
      const response = await fetch(url, options)
      const json = await response.json()
      this.recipes = json.recipes
      this.hideDeleteConfirm()
      router.back();

    },
    async addOrEditRecipe() {
      if (this.overlayInput.overlayType === "edit") {
        this.editRecipe();
      }
      else {
        this.addRecipe();
      }
    },
    async editRecipe() {
      let url = `/api/recipes/${this.editRecipeId} `
      let token = localStorage.getItem("authToken")
      let recipe = {
        name: this.overlayInput.recipeNameInput,
        ingredients: this.overlayInput.recipeIngredientsInput,
        steps: this.overlayInput.recipeStepsInput,
        imageUrl: this.overlayInput.imageUrl,
        hostname: this.overlayInput.hostname,
        fullUrl: this.overlayInput.urlToScrapeInput
      }
      let body = { recipe }
      let options = {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token} `
        }
      }
      try {
        const response = await fetch(url, options)
        const json = await response.json()
        this.recipes = json.recipes
        this.hideForm()

      } catch (error) {
        console.error('Error updating the recipe:', error)
      }

    },
    async addRecipe() {
      let url = '/api/recipes'
      let token = localStorage.getItem("authToken")
      let recipe = {
        name: this.overlayInput.recipeNameInput,
        ingredients: this.overlayInput.recipeIngredientsInput,
        steps: this.overlayInput.recipeStepsInput,
        image_url: this.overlayInput.imageUrl,
        hostname: this.overlayInput.hostname,
        url: this.overlayInput.urlToScrapeInput
      }
      let body = { recipe }
      let options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
      const response = await fetch(url, options)
      const json = await response.json()
      this.recipes = json.recipes
      this.addRecipeName = ""
      this.hideForm();
    },
    showAddForm() {
      this.overlayInput.overlayType = "add"
    },
    showEditForm(recipe) {
      this.overlayInput.overlayType = "edit"
      this.editRecipeId = recipe.id
      this.overlayInput.recipeNameInput = recipe.name
      this.overlayInput.recipeIngredientsInput = (recipe.ingredients || [""])
      this.overlayInput.recipeStepsInput = (recipe.steps || [""])
    },
    addIngredientInput(event) {
      this.overlayInput.recipeIngredientsInput.push("")
    },
    removeIngredientInput(ingredientIndex) {
      this.overlayInput.recipeIngredientsInput.splice(ingredientIndex, 1)
    },
    addStepInput(event) {
      this.overlayInput.recipeStepsInput.push("")
    },
    removeStepInput(stepIndex) {
      this.overlayInput.recipeStepsInput.splice(stepIndex, 1)
    },
    hideForm() {
      this.overlayInput.overlayType = "none"
      this.editRecipeId = null
      this.overlayInput.recipeNameInput = ""
      this.overlayInput.recipeIngredientsInput = [""]
      this.overlayInput.recipeStepsInput = [""]
      this.overlayInput.imageUrl = ""
      this.overlayInput.urlToScrapeInput = ""
    },
    signOut() {
      stytchClient.session.revoke();
      this.goToSignIn()
      this.isAuthenticated = false;
    },

    goToSignIn(currentPath) {
      let signInRoute = `/sign-in`
      if(currentPath) {
        signInRoute = signInRoute + `?next_route=${encodeURIComponent(currentPath)}`;
      } 
      router.push(signInRoute);
    },
    async authenticateMagicLink(token, next_route) {
      try {
        const authResponse = await stytchClient.magicLinks.authenticate(token, {
          session_duration_minutes: 60
        });
        if (authResponse.status_code === 200) {
          console.log("Authenticated successfully");
          this.isAuthenticated = true;
          if(next_route) {
            router.push(next_route)
          }
          else {
            router.push('/app')
          }
          ; // Redirect or handle post-authentication logic
        } else {
          console.error(authResponse.error_message);
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
    },
    async authenticateOAuth(token, next_route) {
      try {
        await stytchClient.oauth.authenticate(token, {
          session_duration_minutes: 60
        });
        console.log('Successful authentication: OAuth');
        this.isAuthenticated = true;
        if(next_route) {
          router.push(next_route)
        }
        else {
          router.push('/app')
        } // Redirect or handle post-authentication logic
      } catch (error) {
        console.error("OAuth authentication failed:", error);
      }
    },
  }
})