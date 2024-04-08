import { html } from '../globals.js'
import RecipeDetail from '../components/recipe-detail.js'
import RightOverlay from '../components/right-overlay.js'
import DeleteModal from '../components/delete-modal.js'

const RecipeDetailPage = {
  template: html`
    <recipe-detail class="max_width_1200px height_fill width_fill" />
    <right-overlay />
    <delete-modal />

  `,
  components: {
    RecipeDetail,
    RightOverlay,
    DeleteModal
  }

}

export default RecipeDetailPage