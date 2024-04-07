import { html } from "../globals.js";

const recipeBoxHtml = html`
<router-link :to="'/app/recipe/' + recipe.id" class="border_invisible rounded recipe_tile tile_grid">
  <div class="column gap_fill height_fill width_fill align_top">
    <img :src="recipe.image_url" class="row width_fill height_140px border_invisible rounded crop_center"> 
    <div class="row font_bold pad_8">
      {{recipe.name}}
    </div>
      <!-- <div class="row gap_fill width_fill">
        <div class="row align_left">
          <img src="/assets/icons/trash-2.svg" @click="deleteRecipe(recipe)" class="pad_left_8 pad_bottom_8 icon height_28px width_28px">
        </div>
        <div class="row align_right">
        <img src="/assets/icons/edit.svg" @click="showEditForm(recipe)" class="pad_right_8 pad_bottom_8 icon height_28px width_28px">
        </div>
      </div> -->
  </div>
</router-link>`

const RecipeBox = {
  props: ['recipe'],
  template: recipeBoxHtml,
  methods: {
    deleteRecipe(recipe) {
      this.$emit("delete-recipe", recipe);
    },
    showEditForm(recipe) {
      this.$emit("show-edit-form", recipe);
    },
  }
}

const RecipeList = {
      props: ['recipes'],
      template: html`
      <div>
        <div class="row width_fill"> 
          <div class="row align_right width_fill pad_16">
            <img @click="showAddForm" class="height_32px width_32px icon" src="/assets/icons/plus-circle.svg">  
          </div>
        </div>
        <main class="grid grid_gap_16 pad_left_16 pad_right_16 pad_bottom_16">
          <recipe-box v-for="recipe in recipes" :recipe="recipe" @show-edit-form="showEditForm" @delete-recipe="showDeleteConfirm"></recipe-box>
        </main>
      </div>`,
      mounted: async function() {
        this.loadRecipes()
      },
      methods: {
        showAddForm: function () {
          this.$emit("show-add-form");
        },
        showDeleteConfirm: function(recipe) {
          this.$emit("show-delete-confirm", recipe);
        },
        showEditForm: function(recipe) {
          this.$emit("show-edit-form", recipe);
        },
        loadRecipes() {
          this.$emit("load-recipes")
        }
      },
      components: {
        RecipeBox
      }

    }
export default RecipeList