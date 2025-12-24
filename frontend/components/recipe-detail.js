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
      <!-- Toast Notification -->
      <transition name="fade">
        <div v-if="showToast" class="toast">
          {{ toastMessage }}
        </div>
      </transition>

      <!-- Week Selector Modal -->
      <div class="modal row align_center width_fill height_fill position_fixed" :class="modalClasses">
        <!-- modal backdrop -->
        <div @click="cancelDateSelection" class="modal_overlay__backdrop"></div>
        <!-- modal content -->
        <div class="modal_overlay column bg_white border pad_16 gap_16 position_relative rounded_8px border_color_gray week-selector-width week-selector-height" :class="modalOverlayClasses" @click.stop>
          <!-- Week Navigation -->
          <div class="row width_fill gap_fill pad_bottom_16">
            <img class="row align_left align_center_y icon" height="24" width="24" src="/assets/icons/chevron-left.svg" @click="decrementWeek" />
            <div class="row align_center_x align_center_y font_20 font_bold">
              {{ weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }} - {{ weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
            </div>
            <img class="row align_right align_center_y icon" height="24" width="24" src="/assets/icons/chevron-right.svg" @click="incrementWeek" />
          </div>

          <!-- Scrollable Days Container -->
          <div class="week-selector-scroll">
            <!-- Days of Week -->
            <div v-for="day in daysOfWeekWithMeals" :key="day.name" class="column width_fill">
              <div class="row width_fill gap_fill font_20 font_bold pad_top_16 pad_bottom_16 border_top border_color_gray">
                <div class="row align_left font_20 font_bold">{{ day.name }}</div>
                <img class="row align_right font_20 font_bold icon" height="24" width="24" src="/assets/icons/plus.svg" @click="selectDay(day.date)" />
              </div>
              <div class="row gap_8 pad_bottom_8 wrap">
                <template v-for="meal in day.meals">
                  <router-link v-if="meal.recipe && meal.recipe.id" :key="meal.meal_plan_id"
                    :to="{ path: '/app/recipe/' + meal.recipe.id, query: meal.servings ? { servings: meal.servings } : {} }"
                    class="border_invisible rounded recipe_tile meal-tile-small">
                    <div class="column height_fill width_fill align_top">
                      <img v-if="meal.recipe.image_url" :src="meal.recipe.image_url" class="border_invisible rounded crop_center">
                      <div class="font_bold">
                        {{ meal.recipe.name }}
                      </div>
                      <div v-if="meal.servings" class="font_12 secondary_text">
                        {{ meal.servings }} {{ meal.servings === 1 ? 'serving' : 'servings' }}
                      </div>
                    </div>
                  </router-link>
                </template>
              </div>
            </div>
          </div>

          <!-- Done Button -->
          <div class="row width_fill pad_top_16 border_top border_color_gray align_right">
            <button @click="cancelDateSelection" class="button rounded">Done</button>
          </div>
        </div>
      </div>

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
          <img v-if="recipeToView.image_url" :src="recipeToView.image_url" class="width_160px height_160px crop_center rounded">
          <div v-else class="row width_160px height_160px border_invisible rounded bg_gray align_center_x align_center_y">
            <div class="font_48">🍽️</div>
          </div>
        </div>
        <div class="column gap_8">
          <div class="font_28 font_bold ">
            {{recipeToView.name}}
          </div>
          <div v-if="recipeToView.url" class="font_16 secondary_link">
            from <a :href="recipeToView.url" target="_blank" class="dotted_underline"> {{recipeToView.hostname}}</a>
          </div>
        </div>
      </div>
      <div class="row gap_fill gap_16 wrap">
        <div class="column align_left gap_16 min_width_300px max_width_400px width_fill">
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
            <div class="row width_fill align_right position_relative gap_16">
              <template v-if="hasRecipeId">
                <img @click="openDatePickerModal" src="/assets/icons/calendar.svg" class="icon pointer" title="Add to Meal Plan">
                <img @click.stop="showModal" src="/assets/icons/shopping-cart.svg" class="icon" title="Add to Shopping List">
              </template>
            </div>
          </div>  
          <div class="column gap_8 width_fill">
            <div v-for="ingredient in this.scaledIngredients" class="row border_bottom border_color_gray">
              <div :class="{'font_italic':ingredient.modified}"> {{ingredient.string}} </div>
            </div>
          </div>
        </div>
        <div class="column align_right gap_16 min_width_300px max_width_700px width_fill">
          <div class="row align_left width_fill font_24 font_bold">Steps</div>
          <div class="column gap_16 width_fill">
            <div v-for="(step, index) in recipeSteps" class="row font_16 gap_16 align_top">
              <div class="font_20 font_bold shrink_none">{{index+1}}</div>
              <div class="width_fill">{{step}}</div>
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
    // Set servings from URL query parameter if present, otherwise use recipe default
    if(this.$route.query.servings) {
      this.desiredServings = parseInt(this.$route.query.servings);
    } else {
      this.desiredServings = this.recipeToView.serving_size;
    }
  },
  data() {
    return {
      loading: false,
      scaleFactor: 1,
      desiredServings: 0,
      saving: false,
      showToast: false,
      toastMessage: '',
      showDatePickerModal: false,
      weekStart: new Date(),
      weekEnd: new Date(),
      mealPlans: []
    }
  },
  computed: {
    modalClasses() {
      return this.showDatePickerModal ? "" : "modal--hidden";
    },
    modalOverlayClasses() {
      return this.showDatePickerModal ? "" : "modal_overlay--hidden";
    },
    daysOfWeek() {
      const days = [];
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      for (let i = 0; i < 7; i++) {
        const date = new Date(this.weekStart);
        date.setDate(this.weekStart.getDate() + i);
        days.push({
          name: dayNames[i],
          date: date
        });
      }
      return days;
    },
    daysOfWeekWithMeals() {
      return this.daysOfWeek.map(day => {
        const meals = this.mealPlans ? this.mealPlans.filter(meal => {
          return meal.meal_date === day.date.toISOString().split('T')[0];
        }).map(meal => {
          return {
            meal_plan_id: meal.meal_plan_id,
            recipe: meal.recipe,
            servings: meal.servings
          };
        }) : [];
        return { ...day, meals };
      });
    },
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
    },
    recipeSteps() {
      // Handle both array and string formats for steps
      if (!this.recipeToView.steps) return [];
      if (Array.isArray(this.recipeToView.steps)) {
        return this.recipeToView.steps;
      }
      // If steps is a string, split by newlines
      return this.recipeToView.steps.split('\n').filter(s => s.trim());
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
      // Navigate to the edit recipe page
      this.$router.push({
        path: `/app/recipe/edit/${this.recipeToView.id}`,
        query: {
          redirect: `/app/recipe/${this.recipeToView.id}`
        }
      });
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
    async openDatePickerModal() {
      this.setWeekStartAndEnd();
      const response = await this.$store.fetchMealPlans();
      this.mealPlans = response.mealPlans || [];
      this.showDatePickerModal = true;
    },
    setWeekStartAndEnd() {
      const today = new Date();
      const dayOfWeek = today.getDay();

      const start = new Date(today);
      start.setDate(today.getDate() - dayOfWeek);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      this.weekStart = start;
      this.weekEnd = end;
    },
    incrementWeek() {
      const newStart = new Date(this.weekStart);
      newStart.setDate(this.weekStart.getDate() + 7);

      const newEnd = new Date(this.weekEnd);
      newEnd.setDate(this.weekEnd.getDate() + 7);

      this.weekStart = newStart;
      this.weekEnd = newEnd;
    },
    decrementWeek() {
      const newStart = new Date(this.weekStart);
      newStart.setDate(this.weekStart.getDate() - 7);

      const newEnd = new Date(this.weekEnd);
      newEnd.setDate(this.weekEnd.getDate() - 7);

      this.weekStart = newStart;
      this.weekEnd = newEnd;
    },
    async selectDay(date) {
      try {
        const mealPlanData = {
          recipe_id: this.recipeToView.id,
          meal_date: date.toISOString().split('T')[0],
          servings: this.desiredServings
        };

        // Optimistically add to local state
        const tempMealPlan = {
          meal_plan_id: `temp-${Date.now()}`,
          meal_date: date.toISOString().split('T')[0],
          recipe: this.recipeToView,
          servings: this.desiredServings
        };
        this.mealPlans.push(tempMealPlan);

        const createdMealPlan = await this.$store.createMealPlan(mealPlanData);

        // Replace temp with real meal plan
        this.mealPlans = this.mealPlans.map(mp =>
          mp.meal_plan_id === tempMealPlan.meal_plan_id
            ? { ...mp, meal_plan_id: createdMealPlan.mealPlan.meal_plan_id }
            : mp
        );
      } catch (error) {
        console.error('Error adding recipe to meal plan:', error);
        // Refresh meal plans on error
        const response = await this.$store.fetchMealPlans();
        this.mealPlans = response.mealPlans || [];
      }
    },
    cancelDateSelection() {
      this.showDatePickerModal = false;
    },
    displayToast(message) {
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
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
