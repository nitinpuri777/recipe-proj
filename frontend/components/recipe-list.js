import { html } from "../globals.js";
import { useStore } from '../store.js'; // Adjust the path as necessary

const RecipeList = {
  template: html`
  <div v-if="loading">
    <loader />
  </div>
  <div v-else>
    <div class="row width_fill"> 
      <div class="row align_right width_fill pad_16">
        <img @click="showAddForm" class="height_32px width_32px icon" src="/assets/icons/plus-circle.svg">  
      </div>
    </div>
    <main class="grid gap_16 pad_left_16 pad_right_16 pad_bottom_16">
      <router-link v-for="recipe in recipes" :key="recipe.id" :to="'/app/recipe/' + recipe.id" class="border_invisible rounded recipe_tile tile_grid">
        <div class="column gap_fill height_fill width_fill align_top">
          <img :src="recipe.image_url" class="row width_fill height_140px border_invisible rounded crop_center"> 
          <div class="row font_bold pad_8">
            {{recipe.name}}
          </div>
        </div>
      </router-link>
    </main>
  </div>`,
  computed: {
    store() {
      return useStore(); // Access the store once here
    },
    recipes() {
      return this.store.recipes; // Access the recipes from the store
    }
  },
  data() {
    return {
      loading: false,
    }
  },
  async mounted() {
    this.loading = true;
    await this.store.loadRecipes(); 
    this.loading = false;// Load recipes from the store when the component mounts
  },
  methods: {
    showAddForm() {
      this.store.showAddForm(); // Call store action to show the add form
    }
  }
}
export default RecipeList
