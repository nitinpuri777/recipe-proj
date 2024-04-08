import AppHeader from '../components/app-header.js'
import RecipeList from '../components/recipe-list.js'
import RightOverlay from '../components/right-overlay.js'

const RecipeListPage = {
  template: `
    <app-header />
    <recipe-list />
    <right-overlay />

  `,
  components: {
    AppHeader,
    RecipeList,
    RightOverlay
  }

}

export default RecipeListPage