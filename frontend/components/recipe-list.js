import RecipeBox from "./recipe-box.js";
const RecipeList = {
      props: ['recipes'],
      template: `<main class="row gap_16 pad_16 wrap">
      <recipe-box v-for="recipe in recipes" :recipe="recipe" @show-edit-form="showEditForm"
        @delete-recipe="showDeleteConfirm"></recipe-box>
      <div @click="showAddForm" class="row align_center width_150px height_150px border recipe_link">
        <span>Add Recipe</span>
      </div>
    </main>`,
      methods: {
        showAddForm: function () {
          this.$emit("show-add-form");
        },
        showDeleteConfirm: function(recipe) {
          this.$emit("show-delete-confirm", recipe);
        },
        showEditForm: function(recipe) {
          this.$emit("show-edit-form", recipe);
        }
      },
      components: {
        RecipeBox
      }

    }
export default RecipeList