import { createApp } from 'vue'
import DeleteModal from './components/delete-modal.js'
import router from './router.js'
import { createPinia } from 'pinia'

const App = createApp({
  components: {
    DeleteModal,
  }
})

App.use(router)
App.use(createPinia())
App.mount('#app')

export default App

