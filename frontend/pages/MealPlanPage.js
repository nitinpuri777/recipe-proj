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
        <div v-for="(day, index) in daysOfWeekWithMeals" :key="day.name" class="column width_fill">
          <div class="row width_fill gap_fill font_20 font_bold pad_top_16 pad_bottom_16 border_top border_color_gray"> 
            <div class="row align_left font_20 font_bold">{{ day.name }}</div>
            <img class="row align_right font_20 font_bold icon" height="24" width="24" src="../assets/icons/plus.svg" @click="showAddRecipeModal(day.date)" />
          </div>
          <div class="grid gap_16">
            <div v-for="recipe in day.meals" :key="recipe.id" class="border_invisible rounded tile_grid max_width_280px">
              <div class="column gap_fill height_fill width_fill align_top">
                <img :src="recipe.image_url" class="row width_fill height_140px border_invisible rounded crop_center"> 
                <div class="row font_bold pad_8">
                  {{recipe.name}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <generic-modal :showModal="isRecipeModalVisible" @close="isRecipeModalVisible = false" @confirm="addRecipesToMealPlan(selectedRecipeIds)" title="Add Recipe" confirmButtonText="Add Recipe">
      <div class="column width_fill pad_left_8 pad_right_8">
        <div class="grid gap_16">
          <div v-for="recipe in recipes" :key="recipe.id" class="border_invisible rounded recipe_tile tile_grid max_width_500px" :class="{ 'selected': selectedRecipeIds.includes(recipe.id) }">
            <div class="column gap_fill height_fill width_fill align_top" @click="toggleSelectedRecipe(recipe.id)">
              <img :src="recipe.image_url" class="row width_fill height_140px border_invisible rounded crop_center"> 
              <div class="row font_bold pad_8">
                {{recipe.name}}
              </div>
              <div v-if="selectedRecipeIds.includes(recipe.id)" class="round">
                <input type="checkbox" :id="'round-checkbox-' + recipe.id" checked />
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
  },
  data() {
    return {
      recipes: [],
      isRecipeModalVisible: false,
      addRecipeToDate: null,
      selectedRecipeIds: [], 
      weekStart: new Date(new Date().setHours(0, 0, 0, 0)),
      weekEnd: new Date(new Date().setHours(0, 0, 0, 0)),
      mealPlans: null,
      daysOfWeek: [
        { name: 'Sunday', offset: 0 },
        { name: 'Monday', offset: 1 },
        { name: 'Tuesday', offset: 2 },
        { name: 'Wednesday', offset: 3 },
        { name: 'Thursday', offset: 4 },
        { name: 'Friday', offset: 5 },
        { name: 'Saturday', offset: 6 }
      ]
    };
  },
  computed: {
    daysOfWeekWithMeals() {
      return this.daysOfWeek.map(day => {
        const date = new Date(this.weekStart);
        date.setDate(date.getDate() + day.offset);
        const meals = this.mealPlans ? this.mealPlans.filter(meal => meal.meal_date === date.toISOString().split('T')[0]).map(meal => meal.recipe) : [];
        return { ...day, date, meals };
      });
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
        this.selectedRecipeIds = this.selectedRecipeIds.filter(rid => rid !== id);
      } else {
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