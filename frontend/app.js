import { createApp } from 'vue'
import router from './router.js'
import { createPinia } from 'pinia'
import Loader from './components/loader.js'

const App = createApp()

App.component('Loader', Loader)

App.use(router)
App.use(createPinia())
App.mount('#app')

export default App

