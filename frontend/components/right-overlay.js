import { html } from "../globals.js";

const RightOverlay = {
  template:
  html`<!-- Backdrop -->
  <div>
  <button @click="hideForm" class="right_overlay__backdrop position_fixed top"
    :class="rightOverlayBackdropClasses"></button>
  <!-- Right Column -->
  <div
    class="column width_fill max_width_480px height_fill gap_16 border_left position_fixed right_overlay top_0 right_0 bg_white scroll"
    :class="rightOverlayClasses">
    <span class="font_24 pad_left_16"> {{ overlayHeader }} </span>
    <!-- Add/Edit Form -->
    <form class="column gap_16 pad_16 wrap" v-if="isFormVisible" @submit.prevent="addOrEditRecipe">
      <!-- Scrape URL Input -->

      <label class="column gap_8">
        <span class="font_bold">URL to Scrape</span>
        <div class="row gap_8">
          <input class="rounded border pad_8" type="text" name="recipeName" v-model="$store.overlayInput.urlToScrapeInput"
            label="Url to Scrape">
          <button type="button" @click="scrapeRecipe($store.overlayInput.urlToScrapeInput)" class="button rounded border">Fetch
            Details</button>
        </div>
      </label>


      <!-- Recipe Name Input -->
      <label class="column gap_8">
        <span class="font_bold">Recipe Name</span>
        <input class="rounded border pad_8" type="text" name="recipeName" v-model="$store.overlayInput.recipeNameInput"
          label="Recipe Name">
      </label>
      <label class="column gap_8">
        <span class="font_bold">Image Url</span>
        <img :src="$store.overlayInput.imageUrl" class="width_160px">
      </label>
      <!-- Ingredients Input -->
      <div class="column gap_8">
        <span class="font_bold">Ingredients</span>
        <div class="row gap_8 align_center" v-for="(ingredient,index) in $store.overlayInput.recipeIngredientsInput">
          <input class="rounded border pad_8 fill" type="text" name="recipeName"
            v-model="$store.overlayInput.recipeIngredientsInput[index]">
          <button type="button" @click="removeIngredientInput(index)" class="button rounded border">x</button>
        </div>
        <div class="row align_left">
          <button type="button" @click="addIngredientInput"
            class="button rounded border pad_left_16 pad_right_16">+</button>
        </div>
      </div>
      <!-- Steps Input -->
      <div class="column gap_8">
        <span class="font_bold">Steps</span>
        <div class="row gap_8 align_top" v-for="(step,index) in $store.overlayInput.recipeStepsInput">
          <div class="pad_top_8">{{index + 1}}.</div>
          <textarea rows="4" class="rounded border pad_8 fill" name="recipeName"
            v-model="$store.overlayInput.recipeStepsInput[index]"></textarea>
          <div class="pad_top_8"> <button type="button" @click="removeStepInput(index)"
              class="button rounded border">x</button></div>
        </div>
        <div class="row align_left">
          <button type="button" @click="addStepInput"
            class="button rounded border pad_left_16 pad_right_16">+</button>
        </div>
      </div>
      <div class="row align_right gap_8">
        <button class="row button__secondary rounded border" @click="hideForm" type="button">Cancel</button>
        <button class="row button rounded border" type="submit">Save</button>
      </div>
    </form>

  </div>
  </div>`,
  methods: {
    hideForm: function() {
      this.$store.hideForm();
    },
    scrapeRecipe: function(urlToScrapeInput) {
      this.$store.scrapeRecipe(urlToScrapeInput)
    },
    addOrEditRecipe: function() {

      this.$store.addOrEditRecipe();
    },
    removeIngredientInput: function(index) {
      this.$store.overlayInput.recipeIngredientsInput.splice(index, 1)
    },
    addIngredientInput: function() {
      this.$store.overlayInput.recipeIngredientsInput.push("")
    },
    removeStepInput: function(index) {
      this.$store.overlayInput.recipeStepsInput.splice(index, 1)
    },
    addStepInput: function() {
      this.$store.overlayInput.recipeStepsInput.push("")
    }
  },
  computed: {
    overlayType() {
      if(this.$store.overlayInput.overlayType) { 
      return this.$store.overlayInput.overlayType;
      }
      else {
        return "none"
      }
    },
    overlayHeader() {
      if (this.overlayType === "add") {
        return "Add Recipe"

      }
      if (this.overlayType === "edit") {
        return "Edit Recipe"
      }
      else {
        return ""
      }
    },
    isFormVisible() {
      return (this.overlayType !== "none")
    },
    rightOverlayClasses() {
      if (this.isFormVisible) {
        return ""
      }
      else {
        return "right_overlay--hidden"
      }
    },
    rightOverlayBackdropClasses() {
      if (this.isFormVisible) {
        return ""
      }
      else {
        return "right_overlay__backdrop--hidden"
      }
    },
  }
  
}

export default RightOverlay