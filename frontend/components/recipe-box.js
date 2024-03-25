const RecipeBox = {
  props: ['recipe'],
  template: `<div class="row align_center width_150px height_150px border ">
      <div class="column gap_16 align_center">
        <div class="row fill ">{{recipe.name}}</div>
        <div class="row align_center gap_8">
          <span @click="showEditForm(recipe)" class="recipe_link">edit</span>
          <span @click="deleteRecipe(recipe)" class="recipe_link">delete</span>
          <a :href="'/recipe.html?recipeId=' + recipe.id" class="recipe_link">view</a>
        </div>
      </div>
    </div>`,
  methods: {
    deleteRecipe(recipe) {
      this.$emit("delete-recipe", recipe);
    },
    showEditForm(recipe) {
      this.$emit("show-edit-form", recipe);
    }
  }
}

export default RecipeBox