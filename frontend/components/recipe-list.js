import { html } from "../globals.js";

const RecipeList = {
  template: html`
  <div v-if="loading" class="column width_fill height_fill">
    <loader></loader>
  </div>
  <div v-else>
    <div class="column gap_16 width_fill height_fill">
      <div class="row ">
        <div class="font_32 font_700 text_nowrap">
          My Saved Recipes
        </div>
        <div class="row gap_8 width_fill align_center_y align_right"> 
          <input type="text" v-model="searchQuery" :class="inputVisibilityClass" class="search_bar_input rounded border border_color_gray pad_8"> <img @click="toggleSearchInput" v-if="showIcon" class="icon" src="/assets/icons/search.svg" /> 
        </div> 
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
      if(this.searchQuery.length == 0) {
        return this.$store.recipes; // Access the recipes from the $store
      }
      else { 
        return this.$store.recipes.filter(recipe => recipe.name.toLowerCase().includes(this.searchQuery.toLowerCase().trim()) )
      }
    },
  },
  data() {
    return {
      loading: false,
      searchQuery:"",
      inputVisibilityClass: "search_bar_input--hidden",
      showIcon: true,
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
    },
    toggleSearchInput() {
      if(this.inputVisibilityClass === "") {
        this.inputVisibilityClass = "search_bar_input--hidden"
        this.showIcon = true
      }
      else {
        this.inputVisibilityClass = ""
        this.showIcon = false
      }
    }
  }
}
export default RecipeList
