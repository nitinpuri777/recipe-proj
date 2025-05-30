import { capitalizeFirstLetter, html } from "../globals.js";
import { toDecimal, toFraction } from 'fraction-parser';
import GenericModal from "./generic-modal.js";
import { parseIngredient } from "parse-ingredient";


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
          <a v-if="!saving" @click="saveRecipe" class="row pad_8 gap_8 button__secondary font_bold rounded border">
            <img src="/assets/icons/bookmark.svg" class="height_20px width_20px" >
            <div class="font_16 font_bold">Save</div>
          </a>
          <a v-else class="row pad_8 gap_8 button__secondary font_bold rounded border">
            <img src="/assets/icons/bookmark.svg" class="height_20px width_20px">
            <div class="font_16 font_bold">Saving...</div>
          </a>
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
        <div class="column align_left gap_16 min_width_300px max_width_400px">
          <div class="row gap_32 align_center_y width_fill">
            <div class="font_24 font_bold">Ingredients</div>
            <div v-if="!recipeToView.serving_size" class="row"> 
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
            <div class="row width_fill align_right position_relative">
              <template v-if="hasRecipeId">
                <img @click.stop="showModal" src="/assets/icons/shopping-cart.svg" class="icon">
              </template>
            </div>
          </div>  
          <div class="column gap_8">
            <div v-for="ingredient in this.scaledIngredients" class="row border_bottom border_color_gray">
              <div :class="{'font_italic':ingredient.modified}"> {{ingredient.string}} </div>
            </div>
          </div>
        </div>
        <div class="column align_right gap_16 min_width_300px max_width_700px">
          <div class="row align_left width_fill font_24 font_bold">Steps</div>
          <div class="column gap_16">
            <div  v-for="(step, index) in recipeToView.steps" class="row font_16 gap_16">
              <div class="font_20 font_bold">{{index+1}}</div>
              <div>{{step}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
    ,
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
      saving: false,
    }
  },
  computed: {
    derivedScaleFactor() { 
      if(this.recipeToView.serving_size) {
        console.log(this.recipeToView.serving_size)
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
          //let quantity = Math.round((ingredient.quantity * factor) * 1000) / 1000 
          let quantity = toFraction((ingredient.quantity * factor), {useUnicodeVulgar: true})
          let scaledIngredient = {
            string:"",
            modified:false
          }
          if(ingredient.quantity > 0 && ingredient.description) {
            scaledIngredient.string = `${quantity} ${ingredient.unitOfMeasure ?? ''} ${ingredient.description}`
            if(factor != 1) {
              scaledIngredient.string = scaledIngredient.string + "*"
              scaledIngredient.modified = true
            }
          }
          else {
            scaledIngredient.string = ingredient.ingredientString

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
        return false
      }
    },
    recipeUrl() {
      if(this.hasUrlQueryParam) {
        return this.$route.query.url
      }
      else {
        return ""
      }
    },
    recipeToView() {
      return this.$store.recipeToView; // Access the recipeToView state from the $store
    }
  },
  components: {
    GenericModal
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
    },
    showModal() {
      this.$emit('show-modal', this.scaledIngredients)
    },
    async saveRecipe() {
      this.saving = true; // Set loading state to true
      try {
        const recipe = await this.$store.scrapeRecipe(this.recipeUrl);
        const createdRecipe = await this.$store.addRecipe(recipe);
        this.$router.replace({ path: `/app/recipe/${createdRecipe.id}` }); // Update the URL without redirecting
      } catch (error) {
        console.error("An error occurred while saving the recipe:", error);
      } finally {
        this.saving = false; // Reset loading state
      }
    }
  }
}

export default RecipeDetail
