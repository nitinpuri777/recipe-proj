import { html } from "../globals.js";

const RecipeList = {
  template: html`
    <div class="column gap_16 width_fill height_fill">
      <div class="row wrap gap_fill">
        <div class="font_32 font_700 text_nowrap">
          My Saved Recipes
        </div>
        <div class="row gap_8 align_center_y align_right"> 
          <!-- <input type="text" v-model="searchQuery" class="search_bar_input width_fill rounded border border_color_gray pad_8">   -->
          <img v-if="!this.$store.searchMode" @click="enableSearchMode" src="/assets/icons/search.svg" class="icon" />
        </div> 
      </div>
      <main class="grid gap_16">
        <router-link v-for="recipe in recipes" :key="recipe.id" :to="'/app/recipe/' + recipe.id" class="border_invisible rounded recipe_tile tile_grid max_width_500px">
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
    searchQuery() {
      return this.$store.searchQuery ?? ""
    },
    recipes() {
      if (this.searchQuery.length === 0) {
        return this.$store.recipes; // Return all recipes if there's no search query
      } else {
        return this.$store.recipes.filter(recipe => {
          // Ensure recipe.name is not null or undefined before calling toLowerCase
          const nameMatches = recipe.name && recipe.name.toLowerCase().includes(this.searchQuery.toLowerCase().trim());
    
          // Filter out null, undefined, and empty strings from ingredients, then join and check
          const ingredientsMatches = recipe.ingredients
            .filter(ingredient => ingredient && ingredient.trim())  // Filter out falsy and empty string values
            .join(';')
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase().trim());
    
          return nameMatches || ingredientsMatches;
        });
      }
    },
  },
  data() {
    return {
      loading: false,
      inputVisibilityClass: "search_bar_input--hidden",
      showIcon: true,
    }
  },
  methods: {
    showAddForm() {
      this.$store.showAddForm(); // Call $store action to show the add form
    },
    enableSearchMode() {
      this.$store.searchMode = true
      this.$store.triggerFocusSearchInput()
    }
  }
}
export default RecipeList
