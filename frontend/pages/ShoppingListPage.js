import AppHeader from "../components/app-header.js"
import { html, capitalizeFirstLetter } from "../globals.js"
import { parseIngredient, unitsOfMeasure } from "parse-ingredient"
import { toDecimal, toFraction } from 'fraction-parser';
import EditIngredientModal from "../components/edit-ingredient-modal.js";
import GenericModal from "../components/generic-modal.js";

const ShoppingListPage = {
  template: html`
  <app-header />
  <div class="row width_fill align_center_x height_fill">
   <div class="row max_width_1000px width_fill pad_left_16 pad_right_16">
    <div id="listOfLists" class="column max_width_280px pad_top_32 width_fill height_fill align_left border_right border_color_subtle_gray">
        <div v-for="list, index in this.$store.shoppingLists" class="row width_fill pad_top_16 pad_bottom_16 pad_right_16 pad_left_16 border_invisible font_16 text_nowrap "> 
          <div @click="this.$store.setCurrentList(list)" class="pointer font_20" :class="{'selected font_bold' : this.$store.currentListId === list.id}"> {{ list.name ? list.name : 'Unnamed List' }} </div>
          <div class="row width_fill align_right align_center_y position_relative"> 
            <img @click.stop="showListMenu(index)" src="/assets/icons/more-horizontal.svg" class="icon" height="16px" width="16px">
            <div v-if="index==listMenuIndex" class="dropdown-menu rounded_8px border_color_gray pad_16 column gap_8">
                <div class="primary_link" @click="deleteList(list.id)">Delete</div>
            </div>
          </div>
        </div>
        <div class="row width_fill align_center_x pad_16 font_bold secondary_link" @click="showCreateNewListModal"> 
            <div> + Create New List </div>
        </div>
    </div> 
    <div class ="column max_width_700px gap_16 width_fill ">
      <div class="row font_24 pad_left_16 pad_top_32 gap_8 align_center_y position_relative">
        <div @click.stop="showDropDownOfLists" class="pointer">
          {{$store.currentList ? $store.currentList.name : 'New List'}}
        </div>
        <div v-if="this.$store.currentList.name" @click.stop="showDropDownOfLists" class="row align_bottom">
          <img id="dropDownOfLists" src="/assets/icons/chevron-down.svg" height="24px" width="24px" class="icon">
        </div>
        <div v-if="isDropDownOfListsVisible" class="dropdown-menu-right rounded_8px border_color_gray pad_16 column gap_8">
          <div v-for="list, index in this.$store.shoppingLists" :key="index">
            <div class="primary_link" @click="selectListFromMenu(list)"> 
              {{ list.name ? list.name : 'Unnamed List' }}
            </div>
          </div>
        </div>
      </div>
      <div class="row width_fill pad_left_8 pad_right_8">
        <input type="text" class="row width_fill pad_8 pad_left_32 rounded_20px border border_color_gray add_item_input"  v-model="inputItem" @keypress.enter="addListItem" placeholder="Add Item"> 
      </div>
      <div class="column bg_gray gap_2 pad_left_8 pad_right_8 pad_top_16 pad_bottom_16">
        <template v-for="item, index in this.$store.currentListItems" :key="index">
          <div v-if="!item.checked" class="row align_center_y width_fill gap_fill pad_8 rounded bg_white">
            <div @click="showEditModal(item)" class= "row gap_8 align_center_y align_left_x width_fill pointer" >
              <div class="font_16 mobile_overflow text_nowrap">{{item.ingredientName}}</div>
              <div class="font_12 font_color_gray">{{item.quantity}} {{item.unitOfMeasure}}</div>
            </div>
            <div class="row align_right">
              <input type="checkbox" v-model="item.checked" class="checkbox" @change="toggleCheckedItem(index)">
            </div>
          </div> 
        </template>
        <div v-if="this.$store.currentListItems.some(value => value.checked === true)" class="row gap_fill width_fill pad_top_16 pad_bottom_8 font_bold">
          <div class="text_nowrap">Checked Items</div>
          <div class="row align_right width_fill">
            <div @click="deleteCheckedItems" class="border row rounded gap_4 pad_left_12 pad_right_12 align_center_y font_12" >
              <img src="/assets/icons/x.svg" height="12px" width="12px">
              <div>Clear</div>
            </div>
          </div>
        </div>
        <template v-for="item, index in this.$store.currentListItems" :key="index">
          <div v-if="item.checked" class="row align_center_y width_fill gap_fill pad_8 rounded bg_white">
            <div class= "row gap_8 align_center_y" :class="{'strikethrough font_color_gray' : item.checked}">
              <div class="font_16">{{item.ingredientName}}</div>
              <div class="font_12 font_color_gray">{{item.quantity}} {{item.unitOfMeasure}}</div>
            </div>
            <div class="row align_right">
              <input type="checkbox" v-model="item.checked" class="checkbox" @change="toggleCheckedItem(index)">
            </div>
          </div> 
        </template>
        </div> 
      </div>
    </div>
</div>
<edit-ingredient-modal @hide-edit-modal="hideEditModal" @delete-item="deleteItem" @save-item="updateListItem" :id="editId" :showModal="showModal" :ingredientName="editIngredientName" :quantity="editQuantity" :unitOfMeasure="editUnitOfMeasure"/>
<generic-modal 
  title="Create List" :showModal="isCreateNewListModalVisible" confirmButtonText="Create List"
  @close="hideCreateNewListModal" @confirm="createList">
  <input type=text class="width_fill rounded font_16 pad_8 border border_color_gray min_width_300px" v-model="inputListName">
</generic-modal>
  `,
  async mounted() {
    await this.$store.getLists()
    if(this.$store.shoppingLists[0]) {
      await this.$store.setCurrentList(this.$store.shoppingLists[0])
    }
    document.addEventListener('click', (event) => {
      if (!this.$el.contains(event.target) && this.listMenuIndex !== null) {
        this.listMenuIndex = null
      }
      if (!this.$el.contains(event.target) && this.isDropDownOfListsVisible) {
        this.isDropDownOfListsVisible = false  // Close the dropdown only if the click is outside the component
      }
    })
  },
  components: {
    EditIngredientModal,
    GenericModal
  },
  data() {
    return {
      inputItem:"",
      inputListName:"",
      showModal:false,
      editId:null,
      editIngredientName:"",
      editQuantity:null,
      editUnitOfMeasure:"",
      editItem:"",
      checkedItems: [],
      listMenuIndex: null,
      isCreateNewListModalVisible: false,
      isDropDownOfListsVisible: false
    }
  },
  methods: {
    async addListItem() {
      await this.$store.addListItem(this.inputItem)
      this.inputItem=""
    },
    showEditModal(item) {
      this.editIngredientName = item.ingredientName
      this.editQuantity = item.quantity
      this.editUnitOfMeasure = item.unitOfMeasure
      this.editId = item.id
      this.showModal = true
    },
    hideEditModal() {
      this.showModal = false
    },
    async updateListItem(item) {
      let indexToUpdate = this.$store.currentListItems.findIndex(listItem => listItem.id == item.id)
      if(indexToUpdate !== -1) {
        this.$store.currentListItems[indexToUpdate].ingredientName = item.ingredientName
        this.$store.currentListItems[indexToUpdate].quantity = item.quantity
        this.$store.currentListItems[indexToUpdate].unitOfMeasure = item.unitOfMeasure
      }
      this.showModal=false
      try {
        await this.$store.updateListItem(this.$store.currentListId, this.$store.currentListItems[indexToUpdate])  
      } catch (error) {
        console.log(error)     
      }
      
    },
    async toggleCheckedItem(index) {
      // this.$store.currentListItems[index].checked = !this.$store.currentListItems[index].checked
      try {
        await this.$store.updateListItem(this.$store.currentListId, this.$store.currentListItems[index])
      }
      catch (error) {
        console.log(error)
      }
    },
    async deleteItem(itemId) {
      let indexToDelete = this.$store.currentListItems.findIndex(listItem => listItem.id == itemId)
      if (indexToDelete > -1) {
        this.$store.currentListItems.splice(indexToDelete, 1);
      }
      this.showModal=false
      try {
        await this.$store.deleteListItem(this.$store.currentListId, itemId)
      } catch (error) {
        console.log(error)
      }

    },
    async deleteCheckedItems() {
      let checkedItems = []
      for (const item of this.$store.currentListItems) {
        if(item.checked) {
          checkedItems.push(item.id)
        }
      }
      for (const itemId of checkedItems) {
        this.deleteItem(itemId)
      }
    },
    async deleteList(listId) {
      let index = this.$store.shoppingLists.findIndex(list => list.id == listId)
      console.log(listId, index)
      this.$store.shoppingLists.splice(index, 1)
      await this.$store.deleteList(listId)
      this.listMenuIndex = null
    },
    showListMenu(index) {
      // Toggle the visibility based on the current state
      if (this.listMenuIndex === index) {
        this.listMenuIndex = null;  // Close the dropdown if it's already open for this index
      } else {
        this.listMenuIndex = index;  // Open the dropdown for the clicked index
      }
    },
    showCreateNewListModal() {
      this.inputListName = "Shopping List"
      this.isCreateNewListModalVisible = true;
    },
    hideCreateNewListModal() {
      this.isCreateNewListModalVisible = false;
    },
    async createList() {
      let newList = {
        name: this.inputListName
      }
      this.$store.shoppingLists.push(newList)
      this.isCreateNewListModalVisible = false;
      try {
        await this.$store.createList(this.inputListName)
      } catch (error) {
        console.log(error)
      }
    },
    async selectListFromMenu(list) {
      this.isDropDownOfListsVisible = false
      await this.$store.setCurrentList(list)
      
    },
    showDropDownOfLists() {
      this.isDropDownOfListsVisible = !this.isDropDownOfListsVisible;
    }
  },
  components: {
    AppHeader,
    EditIngredientModal,
    GenericModal

  }

  
}

export default ShoppingListPage