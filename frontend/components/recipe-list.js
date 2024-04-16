import { html } from "../globals.js";

const RecipeList = {
  template: html`
  <div v-if="loading" class="column width_fill height_fill">
    <loader></loader>
  </div>
  <div v-else>
    <div class="column gap_16 width_fill height_fill">
      <div class="font_32 font_700">
        My Saved Recipes
      </div>
      <main class="grid gap_16">
        <router-link v-for="recipe in recipes" :key="recipe.id" :to="'/app/recipe/' + recipe.id" class="border_invisible rounded recipe_tile tile_grid">
          <div class="column gap_fill height_fill width_fill align_top">
            <img :src="recipe.image_url" class="row width_fill height_140px border_invisible rounded crop_center"> 
            <div class="row font_bold pad_8">
              {{recipe.name}}
            </div>
          </div>
        </router-link>
      </main>
    </div>
  </div>`,
  computed: {
    recipes() {
      return this.$store.recipes; // Access the recipes from the $store
    }
  },
  data() {
    return {
      loading: false,
    }
  },
  async mounted() {
    this.loading = true;
    await this.$store.loadRecipes(); 
    this.loading = false;// Load recipes from the $store when the component mounts
  },
  methods: {
    showAddForm() {
      this.$store.showAddForm(); // Call $store action to show the add form
    }
  }
}
export default RecipeList
