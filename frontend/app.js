import { createApp } from 'vue'
import router from './router.js'
import { createPinia } from 'pinia'
import Loader from './components/loader.js'
import { useStore } from './store.js'

const App = createApp()

App.component('Loader', Loader)

App.use(router)
App.use(createPinia())
App.use({
  install(app, options) {
    app.config.globalProperties.$store = useStore();
  }
})
App.mount('#app')

export default App

