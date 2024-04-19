import { html } from "../globals.js";

const RecipeDetail = {
  template: html`
  <div v-if="loading">
    <loader />
  </div>
    <div v-else class="column gap_16 width_fill pad_left_16 pad_top_16 pad_right_16">
      <div class="row width_fill gap_fill">
        <div class="row align_left">
          <img src="/assets/icons/arrow-left.svg" class="height_28px width_28px icon" @click="goBack">
        </div>  
        <div v-if="hasRecipeId" class="row align_right gap_16">
          <img src="/assets/icons/edit-2.svg" class="height_28px width_28px icon" @click="showEditForm">
          <img src="/assets/icons/trash-2.svg" class="height_28px width_28px icon" @click="showDeleteConfirm">
        </div>
        <div v-if="!hasRecipeId" class="row align_right gap_16">
          <router-link :to="{ path: '/save-recipe', query: { url: recipeUrl } }">
            <img src="/assets/icons/bookmark.svg" class="height_28px width_28px icon">
          </router-link>
        </div>
      </div> 
      <div class="row gap_16">
        <div>
          <img :src="recipeToView.image_url" class="width_160px height_160px crop_center rounded">
        </div>
        <div class="column gap_8">
          <div class="font_28 font_bold ">
            {{recipeToView.name}}
          </div>
          <div class="font_16 secondary_link">
            from <a :href="recipeToView.url" target="_blank" class="dotted_underline"> {{recipeToView.hostname}}</a>
          </div>
        </div>
      </div>
      <div class="row gap_fill gap_16 wrap">
        <div class="column align_left gap_16 min_width_300px max_width_576px">
          <div class="row gap_32 align_center_y">
            <div class="font_24">Ingredients</div>
            <div v-if="!recipeToView.serving_size"> 
              <div class="row">
              <button @click="this.scaleFactor = 0.5" class="button font_12 rounded_left ">0.5x</button>
              <button @click="this.scaleFactor = 1" class="button font_12">1x</button>
              <button @click="this.scaleFactor = 2" class="button font_12">2x</button>
              <button @click="this.scaleFactor = 3" class="button font_12 rounded_right">3x</button>
              </div>
            </div>
            <div v-else>
              <div class="row">
                <button @click="decrementDesiredServings" class="button font_12 rounded_left ">-</button>
                <input type="text" v-model="desiredServingsInput" class="border width_100px text_center">
                <button @click="incrementDesiredServings" class="button font_12 rounded_right">+</button>
              </div>
            </div> 
          </div>  
          <ul class="bullets  column gap_8">
            <li v-for="ingredient in this.scaledIngredients">{{ingredient}}</li>
          </ul>
        </div>
        <div class="column align_right gap_16 min_width_300px max_width_576px">
          <div class="row align_left width_fill font_24">Steps</div>
          <ol class="numbers column gap_8">
            <li v-for="step in recipeToView.steps">{{step}}</li>
          </ol>
        </div>
      </div>
    </div>`,
  async mounted() {
    if(!this.$store.recipeToView.name || this.hasRecipeId) {
    this.loading = true;
    await this.renderRecipe();
    console.log(this.recipeToView)
    this.loading = false;
    }
    this.desiredServings = this.recipeToView.serving_size
  },
  data() {
    return {
      loading: false,
      scaleFactor: 1,
      desiredServings: 0,
      
    }
  },
  computed: {
    derivedScaleFactor() { 
      if(this.recipeToView.serving_size) {
        return this.desiredServings / this.recipeToView.serving_size
      }
      else {
        return this.scaleFactor
      }
    },
    desiredServingsInput() { 
      if(this.desiredServings > 1) {
        return `${this.desiredServings} servings`
      }
      else { 
        return `${this.desiredServings} serving`
      }
      
    },
    parsedIngredients() {
      if(this.$store.recipeToView.parsedIngredients) {
        return this.$store.recipeToView.parsedIngredients
      }
      else{
        return null
      }
    },
    scaledIngredients() { 
      if(this.parsedIngredients){
        let factor = this.derivedScaleFactor
        let scaledIngredients = []
        for (const ingredient of this.parsedIngredients) {
          let quantity = Math.round((ingredient.quantity * factor) * 1000) / 1000 
          let scaledIngredient = ""
          if(quantity && ingredient.description) {
            scaledIngredient = `${quantity} ${ingredient.unitOfMeasure ?? ''} ${ingredient.description}`
            if(factor != 1) {
              scaledIngredient = scaledIngredient + "*"
            }
          }
          else {
            scaledIngredient = ingredient.ingredientString

          }
          
          scaledIngredients.push(scaledIngredient)
        }
        return scaledIngredients
      }
    },
    hasUrlQueryParam() {
      if(this.$route.query.url) {
        return true
      }
      else {
        return false
      }
    },
    hasRecipeId(){
      if(this.$route.params.id) {
        return true
      }
      else {
        false
      }
    },
    recipeUrl() {
      if(this.hasUrlQueryParam) {
        return this.$route.query.url
      }
      else {
        ""
      }
    },
    recipeToView() {
      return this.$store.recipeToView; // Access the recipeToView state from the $store
    }
  },
  methods: {
    async renderRecipe() {
      if(this.hasUrlQueryParam) {
        await this.scrapeRecipe(this.$route.query.url);
      }
      if(this.hasRecipeId) {
        await this.fetchRecipe()
      }
    },
    async fetchRecipe() {
      if(this.$route.params.id) { 
      const recipeId = this.$route.params.id;
      await this.$store.fetchRecipe(recipeId);
      } // Call the fetchRecipe action from the $store
    },
    goBack() {
      this.$router.back();
    },
    showDeleteConfirm() {
      this.$store.showDeleteConfirm(this.recipeToView); // Call the showDeleteConfirm action from the $store
    },
    showEditForm() {
      this.$store.showEditForm(this.recipeToView); // Call the showEditForm action from the $store
    },
    async scrapeRecipe(url) {
        this.$store.recipeToView = await this.$store.scrapeRecipe(url)
    },
    incrementDesiredServings() {
      this.desiredServings++
    },
    decrementDesiredServings() {
      if(this.desiredServings > 1) {
        this.desiredServings--
      }
    }
    
  }
}

export default RecipeDetail
