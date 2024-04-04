import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Header from './components/header.js'
import RecipeList from './components/recipe-list.js'
import RecipeDetail from './components/recipe-detail.js'
import RightOverlay from './components/right-overlay.js'
import DeleteModal from './components/delete-modal.js'
import SignInPage from './pages/sign-in.js'
import StytchAuthUI from './components/auth/stytch-auth-ui.js'
import Authenticate from './components/auth/authenticate.js'
import stytchClient from './components/auth/stytch-client.js'

const routes = [
  { 
    path: '/app', 
    components: {
      default:RecipeList,
      top:Header,
      right:RightOverlay
    }
  },
  { 
    path: '/app/recipe/:id', 
    components: {
      default: RecipeDetail,
      top:Header,
      right:RightOverlay
    }
  },
  { path: `/sign-in`, component: StytchAuthUI},
  { path: `/authenticate`, component: Authenticate},
  { path: '/:catchAll(.*)', redirect: '/app' },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const App = createApp({
  async mounted() {
    this.loadRecipes()
    //this.recipeToView = await this.fetchRecipe(this.recipes[0].id)
  },
  components: {
    Header,
    RecipeList,
    RecipeDetail,
    RightOverlay,
    DeleteModal,
    SignInPage,
    StytchAuthUI
  },
  data() {
    const data = {
      showDelete: false,
      recipes: [],
      editRecipeId: null,
      overlayInput: {
        overlayType: "none",
        recipeNameInput: "",
        recipeIngredientsInput: [""],
        recipeStepsInput: [""],
        urlToScrapeInput: "",
      },
      recipeToDelete: {},
      recipeToView: {}
    }
    return data;

  },
  computed: {
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
  methods: {
    loadRecipes: async function() { 
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
      this.urlToScrapeInput = ""
    },
    signInSubmit: async function(email, password) {
			let url = '/api/sign-in'
			let body = {
				email: email,
				password: password
			}
			let options = {
				method: 'POST',
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json',
				}
			}
			const response = await fetch(url, options)
			const json = await response.json()
			if (json.token != null) {
				localStorage.setItem("authToken", json.token);
				router.push('/app')
        this.loadRecipes()
			}
		},
    goToApp: function() {
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
    fetchRecipe: async function (recipeId) {
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
        steps: this.overlayInput.recipeStepsInput
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
    },
    signOut() {
      stytchClient.session.revoke();
      this.goToSignIn()
    },

    goToSignIn() {
      router.push('/sign-in')
    }
  }
})

router.beforeEach(async (to, from) => {
  if(!stytchClient.session.getSync() && to.path !=='/sign-in' && to.path !=='/authenticate') {
    return {path: '/sign-in'}
  } 
})

App.use(router)
App.mount('#app')

export default App

