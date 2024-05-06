import AppHeader from "../components/app-header.js"
import { html } from "../globals.js"

const ShoppingListPage = {
  template: html`
  <app-header />
  <div class="row width_fill align_center_x height_fill">
   <div class="row max_width_1000px width_fill pad_left_16 pad_right_16">
    <div class="column max_width_280px pad_top_32 width_fill height_fill align_left border_right border_color_subtle_gray">
        <div @click="this.$store.setCurrentList(list.id)" v-for="list, index in this.$store.shoppingLists" class="row width_fill gap_8 button__secondary border_invisible"> 
            List {{index+1}}
        </div>
        <div  class="button__secondary" @click="this.$store.createList"> + Create New List </div>
    </div> 
    <div class ="column max_width_700px gap_8 width_fill">
      <div class="font_24 pad_left_16 pad_top_32">Shopping List</div>
      <div class="column bg_gray gap_2 pad_left_8 pad_right_8 pad_top_16 pad_bottom_16"> 
          <div v-for="item, index in this.$store.currentListItems" class="row align_center_y width_fill gap_fill pad_8 rounded bg_white">
            <div class= "row gap_8 align_center_y" :class="{'strikethrough font_color_gray' : checkedItems[index]}">
              <div class="font_16">{{item.ingredientName}}</div>
              <div class="font_12 font_color_gray">{{item.quantity}} {{item.unitOfMeasure}}</div>
            </div>
            <div class="row align_right">
              <input type="checkbox" v-model="checkedItems[index]" class="checkbox" @change="toggleCheckedItem(index)">
            </div>
          </div> 
        </div> 
        <div class="row">
          <input type="text" v-model="inputIngredientName" placeholder="Ingredient Name">
          <input type="number" v-model="inputQuantity" placeholder="Quantity">
          <input type="text" v-model="inputUnitOfMeasure" placeholder="Unit of Measure">
          <div  class="button" @click="addListItem"> Add Item </div>
        </div>
      </div>
    </div>
</div>
  `,
  async mounted() {
    await this.$store.getLists()
    if(this.$store.shoppingLists) {
      console.log(this.$store.shoppingLists[0].id)
      await this.$store.setCurrentList(this.$store.shoppingLists[0].id)
    }
  },
  data() {
    return {
      inputIngredientName:"",
      inputQuantity:null,
      inputUnitOfMeasure:"",
      checkedItems: [],
    }
  },
  methods: {
    async addListItem() {
      let itemDetails = {
        ingredientName: this.inputIngredientName,
        quantity: this.inputQuantity,
        unitOfMeasure: this.inputUnitOfMeasure
      }
      await this.$store.createListItem(this.$store.currentListId, itemDetails)
      this.inputIngredientName = ""
      this.inputQuantity = ""
      this.inputUnitOfMeasure = ""
    },
  },
  components: {
    AppHeader

  }

  
}

export default ShoppingListPage