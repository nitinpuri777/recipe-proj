import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import RecipeBox from './components/recipe-box.js'
import Sidebar from './components/sidebar.js'
import RecipeList from './components/recipe-list.js'
import RecipeDetail from './components/recipe-detail.js'

const App = createApp({
  async mounted() {
    this.recipes = await this.fetchRecipes()
    this.recipeToView = await this.fetchRecipe(this.recipes[0].id)
  },
  components: {
  
    Sidebar,
    RecipeList,
    RecipeDetail
  },
  data() {
    return {
      overlayType: "none",
      showDelete: false,
      recipes: [],
      editRecipeId: null,
      recipeNameInput: "",
      recipeIngredientsInput: [""],
      recipeStepsInput: [""],
      urlToScrapeInput: "",
      recipeToDelete: {},
      recipeToView: {}
    }

  },
  computed: {
    overlayHeader() {
      if (this.overlayType === "add") {
        return "Add Recipe"

      }
      if (this.overlayType === "edit") {
        return "Edit Recipe"
      }
      else {
        return ""
      }
    },
    isFormVisible() {
      return (this.overlayType !== "none")
    },
    rightOverlayClasses() {
      if (this.isFormVisible) {
        return ""
      }
      else {
        return "right_overlay--hidden"
      }
    },
    rightOverlayBackdropClasses() {
      if (this.isFormVisible) {
        return ""
      }
      else {
        return "right_overlay__backdrop--hidden"
      }
    },
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
    }
  },
  methods: {
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
      this.recipeIngredientsInput = json.recipe.ingredients
      this.recipeStepsInput = json.recipe.steps
      this.recipeNameInput = json.recipe.name
      this.urlToScrapeInput = ""
    },
    async fetchRecipes() {
      if (!localStorage.getItem("authToken")) {
        this.goToSignIn()
      }
      else {
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
      }
    },
    fetchRecipe: async function (recipeId) {
      if (!localStorage.getItem("authToken")) {
        this.goToSignIn()
      }
      else {
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
        return json.recipe
      }
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

    },
    async addOrEditRecipe() {
      if (this.overlayType === "edit") {
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
        name: this.recipeNameInput,
        ingredients: this.recipeIngredientsInput,
        steps: this.recipeStepsInput
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
        name: this.recipeNameInput,
        ingredients: this.recipeIngredientsInput,
        steps: this.recipeStepsInput,
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
      this.overlayType = "add"
    },
    showEditForm(recipe) {
      this.overlayType = "edit"
      this.editRecipeId = recipe.id
      this.recipeNameInput = recipe.name
      this.recipeIngredientsInput = (recipe.ingredients || [""])
      this.recipeStepsInput = (recipe.steps || [""])
    },
    addIngredientInput(event) {
      this.recipeIngredientsInput.push("")
    },
    removeIngredientInput(ingredientIndex) {
      this.recipeIngredientsInput.splice(ingredientIndex, 1)
    },
    addStepInput(event) {
      this.recipeStepsInput.push("")
    },
    removeStepInput(stepIndex) {
      this.recipeStepsInput.splice(stepIndex, 1)
    },
    hideForm() {
      this.overlayType = "none"
      this.editRecipeId = null
      this.recipeNameInput = ""
      this.recipeIngredientsInput = [""]
      this.recipeStepsInput = [""]
    },
    signOut() {
      localStorage.removeItem("authToken")
      this.goToSignIn()
    },

    goToSignIn() {
      window.location.href = '/'
    }
  }
})

export default App

