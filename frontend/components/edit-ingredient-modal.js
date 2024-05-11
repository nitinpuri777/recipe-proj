import { html } from "../globals.js";
import { unitsOfMeasure } from "parse-ingredient"

const EditIngredientModal = {
  template: html` 
  <div class="modal row align_center width_fill height_fill position_fixed" :class="modalClasses">
  <!-- modal backdrop -->
  <button @click="hideEditIngredient" class="modal_overlay__backdrop"></button>
  <!-- modal content -->
  <div class="modal_overlay min_width_400px column bg_white border pad_16 gap_16 position_relative rounded_8px border_color_gray" :class="modalOverlayClasses">
    <div class="row font_24">Edit Item</div>
    <div class="column gap_16"> 
      <input type="text" v-model="inputIngredientName" class="border border_color_gray rounded_8px pad_8 width_fill"/>
      <div class="row gap_16 width_fill">
        <input type="number" v-model="inputQuantity" class="border border_color_gray rounded_8px pad_8" /> 
        <select  v-model="inputUnitOfMeasure" class="border border_color_gray rounded_8px pad_8 width_fill custom_select">
          <option v-for="uom, key in unitsOfMeasure" :value="uom.short"> {{key}}</option>
        </select>
      </div>  
    </div>
    <div class="row width_fill gap_fill pad_top_16">
      <img @click="deleteItem(id)" src="/assets/icons/trash-2.svg" class="icon">
      <div class="row width_fill gap_8 align_right">
        <button @click="hideEditIngredient" type="button" class="button__secondary rounded">Cancel</button>
        <button @click="saveItem" type="button" class="button rounded">Save</button>
      </div>
    </div>
  </div>
</div>`,
props: {
  id: Number,
  ingredientName: String,
  quantity: Number,
  unitOfMeasure: String,
  showModal: Boolean
},
async mounted() {
  console.log(this.unitsOfMeasure)
},
data() {
  return {
    inputId: this.id,
    inputIngredientName: this.ingredientName,
    inputQuantity: this.quantity,
    inputUnitOfMeasure: this.unitOfMeasure,
  }
},
watch: {
  ingredientName(newVal) {
    this.inputIngredientName = newVal;
  },
  quantity(newVal) {
    this.inputQuantity = newVal;
  },
  unitOfMeasure(newVal) {
    this.inputUnitOfMeasure = newVal;
  },
},
computed: {
  unitsOfMeasure() {
    return unitsOfMeasure
  },
  itemToSave() {
    return {
      ingredientId: this.inputId,
      ingredientName: this.inputIngredientName,
      quantity: this.inputQuantity,
      unitOfMeasure: this.inputUnitOfMeasure,
      id: this.id
    }
  },
  modalClasses() {
    if (this.showModal) {
      return ""
    }
    else {
      return "modal--hidden"
    }
  },
  modalOverlayClasses() {
    if (this.showModal) {
      return ""
    }
    else {
      return "modal_overlay--hidden"
    }
  },
},
methods: {
  hideEditIngredient() {
    this.$emit('hide-edit-modal')
  },
  saveItem() {
    this.$emit('save-item', this.itemToSave); // Call $store action to delete the recipe
  },
  deleteItem(itemId) {
    this.$emit('deleteItem', itemId);
  }
}
} 
export default EditIngredientModal
