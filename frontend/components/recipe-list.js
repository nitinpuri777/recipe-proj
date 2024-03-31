const RecipeBox = {
  props: ['recipe'],
  template: `<div class="row align_center width_150px height_150px border ">
      <div class="column gap_16 align_center">
        <div class="row fill ">{{recipe.name}}</div>
        <div class="row align_center gap_8">
          <span @click="showEditForm(recipe)" class="recipe_link">edit</span>
          <span @click="deleteRecipe(recipe)" class="recipe_link">delete</span>
          <router-link :to="'/app/recipe/' + recipe.id">view</router-link>
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
      <div @click="showAddForm" class="row align_center width_150px height_150px border recipe_link">
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