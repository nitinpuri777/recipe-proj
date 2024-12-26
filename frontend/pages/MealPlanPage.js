import { ref, onMounted } from 'vue';
import { useStore } from '../store.js';
import AppHeader from "../components/app-header.js"
import GenericModal from "../components/generic-modal.js"
import RecipeList from "../components/recipe-list.js"
import SearchHeader from "../components/search-header.js"
const MealPlanPage = {
  template: `
    <app-header />
    <div class="row width_fill align_center_x height_fill" id="container">
        <div class="column max_width_800px width_fill pad_left_16 pad_right_16 pad_top_16 pad_bottom_16">
            <div class="row width_fill font_28 font_bold pad_bottom_16"> Meal Planner </div>
            <div class="row width_fill gap_fill pad_top_16 pad_bottom_16">
                <img class="row align_left align_center_y icon" height="24" width="24" src="../assets/icons/chevron-left.svg" @click="decrementWeek" />
                <div class="row align_center_x align_center_y font_20 font_bold"> {{weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}} - {{weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}}</div>
                <img class="row align_right align_center_y icon" height="24" width="24" src="../assets/icons/chevron-right.svg" @click="incrementWeek" />
            </div> 
            <div class="column width_fill">
              <div class="row width_fill gap_fill font_20 font_bold pad_top_16 pad_bottom_16 border_top border_color_gray"> 
                <div class="row align_left font_20 font_bold">Sunday</div>
                <img class="row align_right font_20 font_bold icon" height="24" width="24" src="../assets/icons/plus.svg" @click="showAddRecipeModal(weekStart)" />
              </div>
              <div class="grid gap_16">
                <div v-for="recipe in sundayMeals" class="border_invisible rounded tile_grid max_width_280px">
                  <div class="column gap_fill height_fill width_fill align_top">
                    <img :src="recipe.image_url" class="row width_fill height_140px border_invisible rounded crop_center"> 
                    <div class="row font_bold pad_8">
                      {{recipe.name}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row width_fill gap_fill font_20 font_bold pad_top_16 pad_bottom_16 border_top border_color_gray"> 
                <div class="row align_left font_20 font_bold"> Monday </div>
                <img class="row align_right font_20 font_bold icon" height="24" width="24" src="../assets/icons/plus.svg" @click="showAddRecipeModal(mondayDate)" />
            </div>
            <div class="row width_fill gap_fill font_20 font_bold pad_top_16 pad_bottom_16 border_top border_color_gray"> 
                <div class="row align_left font_20 font_bold"> Tuesday </div>
                <img class="row align_right font_20 font_bold icon" height="24" width="24" src="../assets/icons/plus.svg" @click="showAddRecipeModal(tuesdayDate)" />
            </div>
            <div class="row width_fill gap_fill font_20 font_bold pad_top_16 pad_bottom_16 border_top border_color_gray"> 
                <div class="row align_left font_20 font_bold"> Wednesday </div>
                <img class="row align_right font_20 font_bold icon" height="24" width="24" src="../assets/icons/plus.svg" @click="showAddRecipeModal(wednesdayDate)" />
            </div>
            <div class="row width_fill gap_fill font_20 font_bold pad_top_16 pad_bottom_16 border_top border_color_gray"> 
                <div class="row align_left font_20 font_bold"> Thursday </div>
                <img class="row align_right font_20 font_bold icon" height="24" width="24" src="../assets/icons/plus.svg" @click="showAddRecipeModal(thursdayDate)" />
            </div>
            <div class="row width_fill gap_fill font_20 font_bold pad_top_16 pad_bottom_16 border_top border_color_gray"> 
                <div class="row align_left font_20 font_bold"> Friday </div>
                <img class="row align_right font_20 font_bold icon" height="24" width="24" src="../assets/icons/plus.svg" @click="showAddRecipeModal(fridayDate)" />
            </div>
            <div class="row width_fill gap_fill font_20 font_bold pad_top_16 pad_bottom_16 border_top border_color_gray"> 
                <div class="row align_left font_20 font_bold"> Saturday </div>
                <img class="row align_right font_20 font_bold icon" height="24" width="24" src="../assets/icons/plus.svg" @click="showAddRecipeModal(saturdayDate)" />
            </div>
        </div>
    </div>
    <generic-modal :showModal="isRecipeModalVisible" @close="isRecipeModalVisible = false" @confirm="addRecipesToMealPlan(selectedRecipeIds)" title="Add Recipe" confirmButtonText="Add Recipe">
      <div class="column width_fill pad_left_8 pad_right_8">
        <div class="grid gap_16">
        <div v-for="recipe in recipes" class="border_invisible rounded recipe_tile tile_grid max_width_500px" :class="{ 'selected': selectedRecipeIds.includes(recipe.id) }">
          <div class="column gap_fill height_fill width_fill align_top" @click="toggleSelectedRecipe(recipe.id)">
            <img :src="recipe.image_url" class="row width_fill height_140px border_invisible rounded crop_center"> 
            <div class="row font_bold pad_8">
              {{recipe.name}}
            </div>
            <div 
        v-if="selectedRecipeIds.includes(recipe.id)"
        class="round"
      >

        <input
          type="checkbox"
          :id="'round-checkbox-' + recipe.id"
          checked
        />
        <label :for="'round-checkbox-' + recipe.id"></label>
      </div>
          </div>
        </div>
      </div>
      </div>
    </generic-modal>
  `,
  async mounted() {
    this.recipes = await this.$store.fetchRecipes();
    this.mealPlans = (await this.$store.fetchMealPlans()).mealPlans;
    this.setWeekStartAndEnd();
    console.log(this.weekStart);
    console.log(this.weekEnd);
    console.log(this.mealPlans);
  },
  data() {
    return {
        recipes: [],
        isRecipeModalVisible: false,
        addRecipeToDate: null,
        selectedRecipeIds: [], 
        weekStart: new Date(new Date().setHours(0, 0, 0, 0)),
        weekEnd: new Date(new Date().setHours(0, 0, 0, 0)),
        mealPlans: null
    };
  },
  computed: {
    mondayDate() {
      const date = new Date(this.weekStart);
      date.setDate(date.getDate() + 1);
      return date;
    },
    tuesdayDate() {
      const date = new Date(this.weekStart);
      date.setDate(date.getDate() + 2);
      return date;
    },
    wednesdayDate() {
      const date = new Date(this.weekStart);
      date.setDate(date.getDate() + 3);
      return date;
    },
    thursdayDate() {
      const date = new Date(this.weekStart);
      date.setDate(date.getDate() + 4);
      return date;
    },
    fridayDate() {
      const date = new Date(this.weekStart);
      date.setDate(date.getDate() + 5);
      return date;
    },
    saturdayDate() {
      const date = new Date(this.weekStart);
      date.setDate(date.getDate() + 6);
      return date;
    },
    sundayMeals() {
      return this.mealPlans ? this.mealPlans.filter(meal => meal.meal_date === this.weekStart.toISOString().split('T')[0]).map(meal => meal.recipe) : [];
    },
    mondayMeals() {
      return this.mealPlans ? this.mealPlans.filter(meal => meal.meal_date === this.mondayDate.toISOString().split('T')[0]).map(meal => meal.recipe) : [];
    },
    tuesdayMeals() {
      return this.mealPlans ? this.mealPlans.filter(meal => meal.meal_date === this.tuesdayDate.toISOString().split('T')[0]).map(meal => meal.recipe) : [];
    },
    wednesdayMeals() {
      return this.mealPlans ? this.mealPlans.filter(meal => meal.meal_date === this.wednesdayDate.toISOString().split('T')[0]).map(meal => meal.recipe) : [];
    },
    thursdayMeals() {
      return this.mealPlans ? this.mealPlans.filter(meal => meal.meal_date === this.thursdayDate.toISOString().split('T')[0]).map(meal => meal.recipe) : [];
    },
    fridayMeals() {
      return this.mealPlans ? this.mealPlans.filter(meal => meal.meal_date === this.fridayDate.toISOString().split('T')[0]).map(meal => meal.recipe) : [];
    },
    saturdayMeals() {
      return this.mealPlans ? this.mealPlans.filter(meal => meal.meal_date === this.saturdayDate.toISOString().split('T')[0]).map(meal => meal.recipe) : [];
    }
  },
  components: {
    AppHeader,
    GenericModal,
    RecipeList,
    SearchHeader
  },
  methods: {
    async addRecipesToMealPlan(recipeIds) {
      for (const recipeId of recipeIds) {
        await this.submitMealPlan(recipeId, this.addRecipeToDate);
      }
      this.hideAddRecipeModal();
      this.clearSelectedRecipes();
    },
    async submitMealPlan(recipeId, mealDate) {
      try {
        const mealPlanData = {
          recipe_id: recipeId,
          meal_date: mealDate
        };
        await this.$store.createMealPlan(mealPlanData);
        this.mealPlans = (await this.$store.fetchMealPlans()).mealPlans;
      } catch (error) {
        console.error('Error creating meal plan:', error);
      }
    },
    toggleSelectedRecipe(id) {
        if (this.selectedRecipeIds.includes(id)) {
          // remove it from array
          this.selectedRecipeIds = this.selectedRecipeIds.filter(rid => rid !== id);
        } else {
          // add it to array
          this.selectedRecipeIds.push(id);
        }
      },
    setWeekStartAndEnd() {
      const today = new Date();
      const dayOfWeek = today.getDay();
      this.weekStart = new Date(today.setHours(0, 0, 0, 0));
      this.weekStart.setDate(today.getDate() - dayOfWeek);
      this.weekEnd = new Date(this.weekStart);
      this.weekEnd.setDate(this.weekStart.getDate() + 6);
    },
    decrementWeek() {
      this.weekStart.setDate(this.weekStart.getDate() - 7);
      this.weekEnd.setDate(this.weekEnd.getDate() - 7);
      this.weekStart = new Date(this.weekStart.setHours(0, 0, 0, 0));
      this.weekEnd = new Date(this.weekEnd.setHours(0, 0, 0, 0));
    },
    incrementWeek() {
      this.weekStart.setDate(this.weekStart.getDate() + 7);
      this.weekEnd.setDate(this.weekEnd.getDate() + 7);
      this.weekStart = new Date(this.weekStart.setHours(0, 0, 0, 0));
      this.weekEnd = new Date(this.weekEnd.setHours(0, 0, 0, 0));
    },
    showAddRecipeModal(date) {
      this.addRecipeToDate = date;
      this.isRecipeModalVisible = true;
    },
    hideAddRecipeModal() {
      this.isRecipeModalVisible = false;
    },
    clearSelectedRecipes() {
      this.selectedRecipeIds = [];
    }
  }
};

export default MealPlanPage; 