import './assets/main.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import CursorFx from '@luxdamore/vue-cursor-fx'
import '@luxdamore/vue-cursor-fx/dist/CursorFx.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(CursorFx)


app.mount('#app')
