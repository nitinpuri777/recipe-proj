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
                <img class="row align_left align_center_y icon" height="24" width="24" src="../assets/icons/chevron-left.svg" />
                <div class="row align_center_x align_center_y font_20 font_bold"> Dec 20 - 28</div>
                <img class="row align_right align_center_y icon" height="24" width="24" src="../assets/icons/chevron-right.svg" />
            </div> 
            <div class="row width_fill gap_fill font_20 font_bold pad_top_16 pad_bottom_16 border_top border_color_gray"> 
                <div class="row align_left font_20 font_bold"> Sunday </div>
                <img class="row align_right font_20 font_bold icon" height="24" width="24" src="../assets/icons/plus.svg" />
            </div>
            <div class="row width_fill gap_fill font_20 font_bold pad_top_16 pad_bottom_16 border_top border_color_gray"> 
                <div class="row align_left font_20 font_bold"> Monday </div>
                <img class="row align_right font_20 font_bold icon" height="24" width="24" src="../assets/icons/plus.svg" />
            </div>
            <div class="row width_fill gap_fill font_20 font_bold pad_top_16 pad_bottom_16 border_top border_color_gray"> 
                <div class="row align_left font_20 font_bold"> Tuesday </div>
                <img class="row align_right font_20 font_bold icon" height="24" width="24" src="../assets/icons/plus.svg" />
            </div>
            <div class="row width_fill gap_fill font_20 font_bold pad_top_16 pad_bottom_16 border_top border_color_gray"> 
                <div class="row align_left font_20 font_bold"> Wednesday </div>
                <img class="row align_right font_20 font_bold icon" height="24" width="24" src="../assets/icons/plus.svg" />
            </div>
            <div class="row width_fill gap_fill font_20 font_bold pad_top_16 pad_bottom_16 border_top border_color_gray"> 
                <div class="row align_left font_20 font_bold"> Thursday </div>
                <img class="row align_right font_20 font_bold icon" height="24" width="24" src="../assets/icons/plus.svg" />
            </div>
            <div class="row width_fill gap_fill font_20 font_bold pad_top_16 pad_bottom_16 border_top border_color_gray"> 
                <div class="row align_left font_20 font_bold"> Friday </div>
                <img class="row align_right font_20 font_bold icon" height="24" width="24" src="../assets/icons/plus.svg" />
            </div>
            <div class="row width_fill gap_fill font_20 font_bold pad_top_16 pad_bottom_16 border_top border_color_gray"> 
                <div class="row align_left font_20 font_bold"> Saturday </div>
                <img class="row align_right font_20 font_bold icon" height="24" width="24" src="../assets/icons/plus.svg" />
            </div>
        </div>
    </div>
    <generic-modal :showModal="isRecipeModalVisible" @close="isRecipeModalVisible = false" @confirm="addRecipeToMealPlan(selectedRecipe)" title="Add Recipe" confirmButtonText="Add Recipe">
      <div class="column width_fill min_width_400px pad_left_8 pad_right_8">
        <!-- <input type="text" class="row width_fill pad_8 pad_left_36 rounded_20px border border_color_gray search_input" placeholder="Search recipes">  -->
        <div class="column width_fill gap_16">
            <div v-for="(recipe, index) in recipes.slice(0,4)" :key="recipe.id" class="row width_fill align_center_y gap_16">
                <div class="round pad_right_8">
                    <input type="checkbox" :id="'checkbox-' + index" v-model="recipe.checked" />
                    <label :for="'checkbox-' + index"></label>
                </div>
                <img :src="recipe.image_url" class="row width_fill height_140px border_invisible rounded crop_center"> 
                <div class="row height_fill align_center_y font_bold pad_8">
              {{recipe.name}}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </generic-modal>
  `,
  async mounted() {
    this.recipes = await this.$store.fetchRecipes();
  },
  data() {
    return {
        recipes: [],
        isRecipeModalVisible: true,
    };
  },
  components: {
    AppHeader,
    GenericModal,
    RecipeList,
    SearchHeader
  },
  methods: {
    async submitMealPlan() {
      try {
        const mealPlanData = {
          recipe_id: this.selectedRecipe,
          meal_date: this.mealDate,
          meal_time: this.mealTime,
          servings: this.servings,
        };
        await this.store.createMealPlan(mealPlanData);
        alert('Meal plan created successfully!');
      } catch (error) {
        console.error('Error creating meal plan:', error);
        alert('Failed to create meal plan.');
      }
    }
  }
};

export default MealPlanPage; 