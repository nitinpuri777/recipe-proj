import { html } from "../globals.js";
import { useStore } from "../store.js";

const DeleteModal = {
  template: html` 
  <div class="modal row align_center width_fill height_fill position_fixed" :class="modalClasses">
  <!-- modal backdrop -->
  <button @click="hideDeleteConfirm" class="modal_overlay__backdrop"></button>
  <!-- modal content -->
  <div class="modal_overlay column bg_white border pad_16 gap_16 position_relative" :class="modalOverlayClasses">
    <div class="row font_32">Delete Recipe</div>
    <div class="row font_bold"> Are you sure you want to delete {{recipeToDelete.name}}?</div>
    <div class="row gap_16 align_right">
      <button @click="hideDeleteConfirm" type="button" class="button__secondary">Cancel</button>
      <button @click="deleteRecipe" type="button" class="button">Delete</button>
    </div>
  </div>
</div>`,
computed: {
  recipeToDelete() {
    return this.$store.recipeToDelete; // Use the $store instance to get the recipe to delete
  },
  modalClasses() {
    return this.$store.modalClasses; // Use the getter for modal classes
  },
  modalOverlayClasses() {
    return this.$store.modalOverlayClasses; // Use the getter for modal overlay classes
  }
},
methods: {
  hideDeleteConfirm() {
    this.$store.hideDeleteConfirm(); // Call $store action to hide delete confirmation
  },
  deleteRecipe() {
    this.$store.deleteRecipe(this.recipeToDelete); // Call $store action to delete the recipe
  }
}
} 
export default DeleteModal
