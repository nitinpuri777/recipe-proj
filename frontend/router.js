import { createMemoryHistory, createRouter } from 'https://unpkg.com/vue-router@4.0.15/dist/vue-router.esm-browser.js'

import RecipeDetail from './components/recipe-detail.js'
import RecipeList from './components/recipe-list.js'

const routes = [
  { path: '/home', component: RecipeList },
  { path: '/recipe/:id', component: RecipeDetail },
]

const Router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default Router