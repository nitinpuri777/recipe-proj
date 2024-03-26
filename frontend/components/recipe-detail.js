const RecipeDetail = {
  props:['recipe'],
  template: `<div class="column gap_16 pad_left_16 pad_top_16">
  <div class="font_32">
    {{recipe.name}}
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

}

export default RecipeDetail