import { capitalizeFirstLetter, html } from '../globals.js'
import RecipeDetail from '../components/recipe-detail.js'
import RightOverlay from '../components/right-overlay.js'
import DeleteModal from '../components/delete-modal.js'
import GenericModal from '../components/generic-modal.js'
import { parseIngredient } from 'parse-ingredient'

const RecipeDetailPage = {
  template: html`
    <recipe-detail @show-modal="showModal" class="max_width_1200px height_fill width_fill" />
    <right-overlay />
    <delete-modal />
    <generic-modal title="Add to Shopping List" :showModal="isModalVisible" confirmButtonText="Add to List" @close="hideModal" @confirm="addIngredientsToList" >
        <div class="column scroll">
            <div v-for="ingredient in this.ingredientsToAdd" class="row gap_fill border_bottom border_color_gray pad_2">
              <div class="text_nowrap width_fill max_width_400px overflow_hidden"> {{ingredient.string}} </div>
              <div class="row align_right align_center_y">
                <input type="checkbox" v-model="ingredient.checked"  class="checkbox">
              </div>
            </div>
          </div>
    </generic-modal>

  `,
  components: {
    RecipeDetail,
    RightOverlay,
    DeleteModal,
    GenericModal
  },
  data() {
    return {
      isModalVisible: false,
      ingredientsToAdd: []
    }
  },
  methods: {
    showModal(ingredients) {
      this.ingredientsToAdd = ingredients.map(item => {
        return { ...item, checked: true }; // Adds isActive attribute to each object
      });
      this.isModalVisible = true;

    },
    hideModal(){
      this.isModalVisible = false;
    },
    async addIngredientsToList(){
      let listId = null
      let lists = await this.$store.getLists()
      console.log(lists)
      if(lists[0]) {
        await this.$store.setCurrentList(lists[0])
        console.log(this.$store.currentListId)
      }
      else {
        console.log("No existing lists")
        this.$store.createList()
        lists = await this.$store.getLists()
        await this.$store.setCurrentList(lists[0])
      }
      console.log(this.ingredientsToAdd)
      for (const item of this.ingredientsToAdd) {
        console.log(item.string, item.checked)
        if(item.checked) {
          this.$store.addListItem(item.string)
        }
      }
      this.hideModal()
    },
    async addListItem(listId, ingredientString) {
      let json = parseIngredient(ingredientString)[0]
      const tempId = `temp-${Date.now()}`;
      let itemDetails = {
        id: tempId,
        ingredientName: capitalizeFirstLetter(json.description),
        quantity: json.quantity,
        unitOfMeasure: json.unitOfMeasure
      }
      this.$store.currentListItems.push(itemDetails)
      this.inputItem = ""
      let listItemResponse = await this.$store.createListItem(listId, itemDetails)
      const index = this.$store.currentListItems.findIndex(item => item.id === tempId);
      if (index !== -1) {
        this.$store.currentListItems[index] = { ...this.$store.currentListItems[index], ...listItemResponse };
      }
      
    }
  }

}

export default RecipeDetailPage