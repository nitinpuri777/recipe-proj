import AppHeader from "../components/app-header.js"
import { html } from "../globals.js"

const CreateRecipePage = {
  template: html`
    <app-header />
    <div class="row width_fill align_center_x height_fill">
      <div class="column max_width_680px width_fill pad_left_16 pad_right_16 pad_top_32 gap_32 pad_bottom_32">
        <!-- Header with back button -->
        <div class="row width_fill gap_fill align_center_y">
          <img src="/assets/icons/arrow-left.svg" class="height_28px width_28px icon pointer" @click="goBack">
          <button @click="saveRecipe" :disabled="isSaving" class="button rounded pad_8 pad_left_16 pad_right_16">
            {{ isSaving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Recipe') }}
          </button>
        </div>

        <!-- Recipe Name -->
        <div class="column gap_8">
          <div class="font_24 font_bold">Recipe Name</div>
          <input
            type="text"
            v-model="recipe.name"
            placeholder="Give your recipe a name"
            class="border border_color_gray rounded_20px pad_8 font_16"
          />
        </div>

        <!-- Servings -->
        <div class="column gap_8">
          <div class="font_20 font_bold">Servings</div>
          <div class="font_16 font_color_gray pad_bottom_4">How many portions does this recipe make?</div>
          <input
            type="number"
            v-model="recipe.servings"
            placeholder="#"
            class="border border_color_gray rounded_20px pad_8 font_16 max_width_200px"
            min="1"
          />
        </div>

        <!-- Ingredients -->
        <div class="column gap_8">
          <div class="font_20 font_bold">Ingredients</div>
          <input
            type="text"
            v-model="ingredientInput"
            @keyup.enter="addIngredient"
            placeholder="Add one or paste multiple items"
            class="border border_color_gray rounded_20px pad_8 font_16"
          />
          <div v-if="recipe.ingredients.length > 0" class="column gap_8 pad_top_8">
            <div
              v-for="(ingredient, index) in recipe.ingredients"
              :key="index"
              class="row gap_8 align_center_y width_fill gap_fill pad_8 rounded bg_white border border_color_gray"
            >
              <div class="width_fill font_16">{{ ingredient }}</div>
              <img
                src="/assets/icons/x.svg"
                class="icon pointer"
                @click="removeIngredient(index)"
                height="20"
                width="20"
              />
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <div class="column gap_8">
          <div class="font_20 font_bold">Instructions</div>
          <textarea
            v-model="recipe.steps"
            placeholder="Paste one or multiple steps (e.g. Finely chop the garlic)"
            class="border border_color_gray rounded_20px pad_8 font_16"
            rows="8"
          ></textarea>
        </div>
      </div>
    </div>
  `,
  async mounted() {
    // Check if we're in edit mode (recipe ID in route params)
    if (this.$route.params.id) {
      this.isEditMode = true;
      await this.loadRecipe(this.$route.params.id);
    }
  },
  data() {
    return {
      recipe: {
        name: '',
        servings: null,
        ingredients: [],
        steps: ''
      },
      ingredientInput: '',
      isSaving: false,
      isEditMode: false
    };
  },
  components: {
    AppHeader
  },
  methods: {
    goBack() {
      // Check if there's a redirect param, otherwise go back in history
      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect);
      } else {
        this.$router.back();
      }
    },
    addIngredient() {
      if (this.ingredientInput.trim()) {
        this.recipe.ingredients.push(this.ingredientInput.trim());
        this.ingredientInput = '';
      }
    },
    removeIngredient(index) {
      this.recipe.ingredients.splice(index, 1);
    },
    async loadRecipe(recipeId) {
      try {
        await this.$store.fetchRecipe(recipeId);
        const fetchedRecipe = this.$store.recipeToView;

        this.recipe = {
          name: fetchedRecipe.name || '',
          servings: fetchedRecipe.serving_size || null,
          ingredients: fetchedRecipe.ingredients || [],
          steps: fetchedRecipe.steps ? fetchedRecipe.steps.join('\n') : ''
        };
      } catch (error) {
        console.error('Error loading recipe:', error);
        alert('Failed to load recipe');
        this.goBack();
      }
    },
    async saveRecipe() {
      if (!this.recipe.name.trim()) {
        alert('Please enter a recipe name');
        return;
      }

      this.isSaving = true;

      try {
        const recipeData = {
          name: this.recipe.name,
          serving_size: this.recipe.servings ? parseInt(this.recipe.servings) : null,
          ingredients: this.recipe.ingredients,
          steps: this.recipe.steps.trim() ? this.recipe.steps.split('\n').filter(s => s.trim()) : []
        };

        let createdRecipe;

        if (this.isEditMode) {
          // Update existing recipe
          recipeData.id = this.$route.params.id;
          createdRecipe = await this.$store.updateRecipe(recipeData);
        } else {
          // Create new recipe
          createdRecipe = await this.$store.addRecipe(recipeData);
        }

        // If we need to add to meal plan (came from meal planner)
        if (this.$route.query.addToMealPlan && this.$route.query.mealDate) {
          const mealPlanData = {
            recipe_id: createdRecipe.id,
            meal_date: this.$route.query.mealDate,
            servings: recipeData.serving_size
          };
          await this.$store.createMealPlan(mealPlanData);
        }

        // Redirect based on where we came from
        if (this.$route.query.redirect) {
          this.$router.push(this.$route.query.redirect);
        } else if (this.isEditMode) {
          // If editing, go to the recipe detail page
          this.$router.push(`/app/recipe/${createdRecipe.id}`);
        } else {
          // If creating new, go to recipes list
          this.$router.push('/app/recipes');
        }
      } catch (error) {
        console.error('Error saving recipe:', error);
        alert('Failed to save recipe. Please try again.');
      } finally {
        this.isSaving = false;
      }
    }
  }
};

export default CreateRecipePage;
