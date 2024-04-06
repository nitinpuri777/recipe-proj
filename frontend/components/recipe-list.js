import { html } from "../globals.js";
const RecipeBox = {
  props: ['recipe'],
  template: 
  html`<div class="row align_center rounded width_160px height_160px border">
      <div class="column gap_fill height_fill width_fill align_bottom">
      <div class="column gap_8">
          <div class="row align_center">
          <router-link :to="'/app/recipe/' + recipe.id" class="recipe_link font_bold">{{recipe.name}}</router-link>
          </div>
          <div class="row gap_fill width_fill">
            <div class="row align_left">
              <img src="/assets/icons/trash-2.svg" @click="deleteRecipe(recipe)" class="pad_left_8 pad_bottom_8 icon height_28px width_28px"></img>
            </div>
            <div class="row align_right">
            <img src="/assets/icons/edit.svg" @click="showEditForm(recipe)" class="pad_right_8 pad_bottom_8 icon height_28px width_28px"></img>
            </div>
          </div>
        </div>
      </div>
    </div>`,
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
      template: `<main class="row gap_16 pad_16 wrap">
      <recipe-box v-for="recipe in recipes" :recipe="recipe" @show-edit-form="showEditForm"
        @delete-recipe="showDeleteConfirm"></recipe-box>
      <div @click="showAddForm" class="row rounded align_center width_160px height_160px border button">
        <span>Add Recipe</span>  
      </div>
    </main>`,
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