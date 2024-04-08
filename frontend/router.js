import { createRouter, createWebHistory } from 'vue-router'
import Authenticate from './components/auth/authenticate.js'
import stytchClient from './components/auth/stytch-client.js'

import SignInPage from './pages/SignInPage.js'
import RecipeListPage from './pages/RecipeListPage.js'
import RecipeDetailPage from './pages/RecipeDetailPage.js'

const routes = [
  { 
    path: '/app', 
    component: RecipeListPage,
  },
  { 
    path: '/app/recipe/:id', 
    name: 'recipeDetail',
    component: RecipeDetailPage 
  },
  { 
    path: `/sign-in`, 
    component: SignInPage
  },
  { 
    path: `/authenticate`, 
    component: Authenticate
  },
  { 
    path: '/:catchAll(.*)', 
    redirect: '/app' 
  },
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