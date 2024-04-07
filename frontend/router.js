import { createRouter, createWebHistory } from 'vue-router'
import Header from './components/header.js'
import RecipeList from './components/recipe-list.js'
import RecipeDetail from './components/recipe-detail.js'
import RightOverlay from './components/right-overlay.js'
import StytchAuthUI from './components/auth/stytch-auth-ui.js'
import Authenticate from './components/auth/authenticate.js'
import stytchClient from './components/auth/stytch-client.js'

const routes = [
  { 
    path: '/app', 
    components: {
      default:RecipeList,
      top:Header,
      right:RightOverlay
    }
  },
  { 
    path: '/app/recipe/:id', 
    name: 'recipeDetail',
    components: {
      default: RecipeDetail,
      // top:Header,
      right:RightOverlay
    }
  },
  { path: `/sign-in`, component: StytchAuthUI},
  { path: `/authenticate`, component: Authenticate},
  { path: '/:catchAll(.*)', redirect: '/app' },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from) => {
  if(!stytchClient.session.getSync() && to.path !=='/sign-in' && to.path !=='/authenticate') {
    return {path: '/sign-in'}
  } 
})

export default router