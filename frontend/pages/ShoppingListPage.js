import AppHeader from "../components/app-header.js"
import { html } from "../globals.js"
import { parseIngredient } from "parse-ingredient"
import { toDecimal, toFraction } from 'fraction-parser';

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
    <div class ="column max_width_700px gap_16 width_fill">
      <div class="font_24 pad_left_16 pad_top_32">Shopping List</div>
      <div class="row width_fill pad_left_8 pad_right_8">
        <input type="text" class="row width_fill pad_8 pad_left_32 rounded_20px border border_color_gray add_item_input"  v-model="inputItem" @keypress.enter="addListItem" placeholder="Add Item"> 
      </div>
      <div class="column bg_gray gap_2 pad_left_8 pad_right_8 pad_top_16 pad_bottom_16">
        <template v-for="item, index in this.$store.currentListItems" :key="index">
          <div v-if="!this.checkedItems[index]" class="row align_center_y width_fill gap_fill pad_8 rounded bg_white">
            <div class= "row gap_8 align_center_y" :class="{'strikethrough font_color_gray' : checkedItems[index]}">
              <div class="font_16">{{item.ingredientName}}</div>
              <div class="font_12 font_color_gray">{{item.quantity}} {{item.unitOfMeasure}}</div>
            </div>
            <div class="row align_right">
              <input type="checkbox" v-model="checkedItems[index]" class="checkbox" @change="toggleCheckedItem(index)">
            </div>
          </div> 
        </template>
        <div v-if="this.checkedItems.some(value => value === true)" class="row pad_top_16 pad_bottom_8 font_bold">Checked Items</div>
        <template v-for="item, index in this.$store.currentListItems" :key="index">
          <div v-if="this.checkedItems[index]" class="row align_center_y width_fill gap_fill pad_8 rounded bg_white">
            <div class= "row gap_8 align_center_y" :class="{'strikethrough font_color_gray' : checkedItems[index]}">
              <div class="font_16">{{item.ingredientName}}</div>
              <div class="font_12 font_color_gray">{{item.quantity}} {{item.unitOfMeasure}}</div>
            </div>
            <div class="row align_right">
              <input type="checkbox" v-model="checkedItems[index]" class="checkbox" @change="toggleCheckedItem(index)">
            </div>
          </div> 
        </template>
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
      inputItem:"",
      checkedItems: [],
    }
  },
  methods: {
    async addListItem() {
      let json = parseIngredient(this.inputItem)[0]
      console.log(json)
      let itemDetails = {
        ingredientName: json.description,
        quantity: json.quantity,
        unitOfMeasure: json.unitOfMeasure
      }
      this.$store.currentListItems.push(itemDetails)
      this.inputItem = ""
      await this.$store.createListItem(this.$store.currentListId, itemDetails)
      
    }
  },
  components: {
    AppHeader

  }

  
}

export default ShoppingListPage