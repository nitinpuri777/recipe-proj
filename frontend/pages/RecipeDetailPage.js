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
    <generic-modal title="" :showModal="isModalVisible" 
      :confirmButtonText="isAddingIngredients ? 'Adding...' : 'Add to List'" 
      @close="hideModal" @confirm="addIngredientsToList" >
        <div class="column scroll">
            <div class="row font_24 font_bold gap_8 position_relative"> 
              <div  class="underline"> 
                Add to
              </div>
              <div @click.stop="showDropDownOfLists" :class="{'dotted_underline pointer' : this.$store.shoppingLists.length > 0}">
                {{$store.currentList.name ? $store.currentList.name : 'New List'}} 
              </div>
              <div v-if="isDropDownOfListsVisible" class="dropdown-menu-right rounded_8px border_color_gray pad_16 column gap_8">
                <div v-for="list, index in this.$store.shoppingLists" :key="index">
                  <div class="primary_link" @click="selectListFromMenu(list)"> 
                    {{ list.name ? list.name : 'Unnamed List' }}
                  </div>
                </div>
              </div> 
            </div>
            <div v-for="ingredient in this.ingredientsToAdd" class="row gap_fill border_bottom border_color_gray pad_2">
              <div class="text_nowrap width_fill max_width_400px overflow_hidden"> {{ingredient.string}} </div>
              <div class="row align_right align_center_y">
                <input type="checkbox" v-model="ingredient.checked"  class="checkbox">
              </div>
            </div>
          </div>
    </generic-modal>

  `,
  async mounted() {
    await this.$store.getLists()
    if(this.$store.shoppingLists[0]) {
      await this.$store.setCurrentList(this.$store.shoppingLists[0])
    }
  },
  components: {
    RecipeDetail,
    RightOverlay,
    DeleteModal,
    GenericModal
  },
  data() {
    return {
      isModalVisible: false,
      ingredientsToAdd: [],
      isCreateNewListModalVisible: false,
      isDropDownOfListsVisible: false,
      isAddingIngredients: false
    }
  },
  methods: {
    showDropDownOfLists() {
      if(this.$store.shoppingLists.length > 0) {
        this.isDropDownOfListsVisible = !this.isDropDownOfListsVisible;
      }
    },
    selectListFromMenu(list) {
      this.isDropDownOfListsVisible = false;
      this.$store.setCurrentList(list)
    },
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
      this.isAddingIngredients = true;
      if (!this.$store.currentList || !this.$store.currentList.id) {
        await this.$store.createList('Shopping List');
        await this.$store.getLists();
        await this.$store.setCurrentList(this.$store.shoppingLists[this.$store.shoppingLists.length - 1]);
      }
    
      if (this.$store.currentList && this.$store.currentList.id) {
        for (const item of this.ingredientsToAdd) {
          if (item.checked) {
            await this.addListItem(this.$store.currentList.id, item.string);
          }
        }
      }
    
      this.hideModal();
      this.isAddingIngredients = false;
    },
    async addListItem(listId, ingredientString) {
      let json = parseIngredient(ingredientString)[0]
      const tempId = `temp-${Date.now()}`;
      let itemDetails = {
        id: tempId,
        ingredientName: capitalizeFirstLetter(json.description),
        quantity: json.quantity,
        unitOfMeasure: json.unitOfMeasure,
        category: json.category
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