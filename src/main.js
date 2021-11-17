import { createApp } from 'vue'
import App from './App.vue'
import supabase from 'vue-3-supabase'
import router from './router'

const app = createApp(App)

app.use(supabase, {
  supabaseUrl: process.env.VUE_APP_DBLINK,
  supabaseKey: process.env.VUE_APP_DBCODE,
  options: {}
})

app.use(router).mount('#app')
