import AppHeader from '../components/app-header.js'
import RecipeList from '../components/recipe-list.js'
import RightOverlay from '../components/right-overlay.js'

const RecipeListPage = {
  template: `
    <app-header />
    <recipe-list class="max_width_1200px height_fill width_fill"/>
    <right-overlay />

  `,
  components: {
    AppHeader,
    RecipeList,
    RightOverlay
  }

}

export default RecipeListPage