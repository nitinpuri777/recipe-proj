import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from './store.js'
import Authenticate from './components/auth/authenticate.js'
import SignInPage from './pages/SignInPage.js'
import RecipeListPage from './pages/RecipeListPage.js'
import RecipeDetailPage from './pages/RecipeDetailPage.js'
import ScrapeRecipePage from './pages/ScrapeRecipePage.js'
import ScrapeDetailPage from './pages/ScrapeDetailPage.js'

const routes = [
  { 
    path: '/scrape', 
    component: ScrapeRecipePage,
    meta: { requiresAuth: false }
  },
  { 
    path: '/recipeDetail', 
    component: ScrapeDetailPage,
    meta: { requiresAuth: false }
  },
  { 
    path: '/app', 
    component: RecipeListPage,
    meta: { requiresAuth: true }
  },
  { 
    path: '/app/recipe/:id', 
    name: 'recipeDetail',
    component: RecipeDetailPage,
    meta: { requiresAuth: true }
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
  const store = useStore()
  const requiresAuth  = to.matched.some(record => record.meta.requiresAuth);
  if(!store.isAuthenticated && requiresAuth) {
    return {path: '/sign-in'}
  } 
})

export default router