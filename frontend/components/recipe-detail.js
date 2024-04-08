import { html } from "../globals.js";
import { useStore } from "../store.js";

const RecipeDetail = {
  template: html`
    <div class="column gap_16 width_fill pad_left_16 pad_top_16 pad_right_16">
      <div class="row width_fill gap_fill">
        <div class="row align_left">
          <img src="/assets/icons/arrow-left.svg" class="height_28px width_28px icon" @click="goBack">
        </div>  
        <div v-if="!isTemporary" class="row align_right gap_16">
          <img src="/assets/icons/edit-2.svg" class="height_28px width_28px icon" @click="showEditForm">
          <img src="/assets/icons/trash-2.svg" class="height_28px width_28px icon" @click="showDeleteConfirm">
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
      <div class="row gap_16 wrap">
        <div class="column gap_16 min_width_300px max_width_500px">
          <div class="font_24">Ingredients</div>
          <ul class="bullets column gap_8">
            <li v-for="ingredient in recipeToView.ingredients">{{ingredient}}</li>
          </ul>
        </div>
        <div class="column gap_16 min_width_300px max_width_500px">
          <div class="font_24">Steps</div>
          <ol class="numbers column gap_8">
            <li v-for="step in recipeToView.steps">{{step}}</li>
          </ol>
        </div>
      </div>
    </div>`,
  mounted() {
    this.renderRecipe();
  },
  computed: {
    isTemporary() {
      if(this.$route.query.url) {
        return true
      }
      else {
        return false
      }
    },
    store() {
      return useStore();
    },
    recipeToView() {
      return this.store.recipeToView; // Access the recipeToView state from the store
    }
  },
  methods: {
    async renderRecipe() {
      if(this.isTemporary) {
        this.temporaryFetchRecipe(this.$route.query.url);
      }
      else {
        this.fetchRecipe()
      }
    },
    async fetchRecipe() {
      if(this.$route.params.id) { 
      const recipeId = this.$route.params.id;
      await this.store.fetchRecipe(recipeId);
      } // Call the fetchRecipe action from the store
    },
    goBack() {
      this.$router.back();
    },
    showDeleteConfirm() {
      this.store.showDeleteConfirm(this.recipeToView); // Call the showDeleteConfirm action from the store
    },
    showEditForm() {
      this.store.showEditForm(this.recipeToView); // Call the showEditForm action from the store
    },
    async temporaryFetchRecipe(url) {
      this.store.recipeToView = await this.store.scrapeRecipe(url)
    }
  }
}

export default RecipeDetail
