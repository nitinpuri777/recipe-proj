import RecipeDetail from '../components/recipe-detail.js'
import RightOverlay from '../components/right-overlay.js'
import DeleteModal from '../components/delete-modal.js'

const RecipeDetailPage = {
  template: `
    <recipe-detail />
    <right-overlay />
    <!-- <delete-modal /> -->

  `,
  components: {
    RecipeDetail,
    RightOverlay,
    // DeleteModal
  }

}

export default RecipeDetailPage