const DeleteModal = {
  template: ` <div class="modal row align_center width_fill height_fill position_fixed" :class="modalClasses">
  <!-- modal backdrop -->
  <button @click="hideDeleteConfirm" class="modal_overlay__backdrop"></button>
  <!-- modal content -->
  <div class="modal_overlay column bg_white border pad_16 gap_16 position_relative" :class="modalOverlayClasses">
    <div class="row font_32">Delete Recipe</div>
    <div class="row font_bold"> Are you sure you want to delete {{recipe.name}}?</div>
    <div class="row gap_16 align_right">
      <button @click="hideDeleteConfirm" type="button" class="button__secondary">Cancel</button>
      <button @click="deleteRecipe(recipe)" type="button" class="button">Delete</button>
    </div>
  </div>
</div>`,
  props:['recipe', 'modalClasses', 'modalOverlayClasses'],
  methods: {
    hideDeleteConfirm() {
      this.$emit("hide-delete-confirm")
    },
    deleteRecipe(recipeToDelete){
      this.$emit("delete-recipe", recipeToDelete)
    }
  }
} 
export default DeleteModal
