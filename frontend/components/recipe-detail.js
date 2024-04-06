import { html } from "../globals.js";
const RecipeDetail = {
  props:['recipe'],
  template: 
  html`
  <div class="column gap_16 pad_left_16 pad_top_16 pad_right_16">
  <div class="row gap_16">
    <div>
      <img :src="recipe.image_url" class="width_160px height_160px crop_center rounded">
    </div>
    <div class="column gap_8">
      <div class="font_28 font_bold ">
      {{recipe.name}}
      </div>
      <div class="font_16 secondary_link">
        from <a :href="recipe.url" target="_blank" class=" dotted_underline"> {{recipe.hostname}}</a>
      </div>
    </div>
    
</div>
  <div class="column gap_16">
    <div class="font_24">Ingredients</div>
    <ul class="bullets column gap_8">
      <li v-for="ingredient in recipe.ingredients">{{ingredient}}</li>
    </ul>
  </div>
  <div class="column gap_16">
    <div class="font_24">Steps</div>
    <ol class="numbers column gap_8">
      <li v-for="step in recipe.steps">{{step}}</li>
      </ol>
  </div>
</div>`,
mounted() {
  // When the component is mounted, fetch the recipe data
  this.fetchRecipe();
},
methods: {
  async fetchRecipe() {
    // Extract the recipeId from the route params
    const recipeId = this.$route.params.id;
    // Emit an event to notify the parent component to fetch the recipe
    this.$emit('fetch-recipe', recipeId);
  }
},

}

export default RecipeDetail