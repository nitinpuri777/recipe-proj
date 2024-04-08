import { createApp } from 'vue'
import router from './router.js'
import { createPinia } from 'pinia'

const App = createApp()

App.use(router)
App.use(createPinia())
App.mount('#app')

export default App

