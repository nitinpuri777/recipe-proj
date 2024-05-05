import AppHeader from "../components/app-header.js"
import { html } from "../globals.js"

const ShoppingListPage = {
  template: html`
  <app-header />
  <div class="row width_fill align_center_x height_fill">
   <div class="row max_width_1000px width_fill pad_left_16 pad_right_16 pad_top_32 gap_16">
    <div class="column max_width_280px width_fill height_fill align_left">
        <div @click="this.$store.setCurrentList(list.id)" v-for="list, index in this.$store.shoppingLists" class="row width_fill gap_8 button__secondary border_invisible"> 
            List {{index+1}}
        </div>
        <div  class="button__secondary" @click="this.$store.createList"> + Create New List </div>
    </div> 
    <div class ="column max_width_700px gap_8 width_fill">
      <div class="font_24">Shopping List</div>
      <div v-for="item in this.$store.currentListItems"> 
          <div class="row gap_8 align_center_y width_fill gap_fill">
            <div>{{item.ingredientName}} -- {{item.quantity}} -- {{item.unitOfMeasure}}</div>
            <div class="row align_right">
              <div class="button" @click="this.$store.deleteListItem(item.listId, item.id)">Delete</div>
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
  },
  data() {
    return {
      inputIngredientName:"",
      inputQuantity:null,
      inputUnitOfMeasure:"",
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
    }
  },
  components: {
    AppHeader

  }

  
}

export default ShoppingListPage