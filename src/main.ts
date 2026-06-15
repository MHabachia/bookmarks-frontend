/**
 * @fileoverview Einstiegspunkt der BookmarkIt Vue.js-Anwendung.
 * @version 2.1 — Auth0 Session-Persistierung via localStorage
 */

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createAuth0 } from '@auth0/auth0-vue'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import AboutView from './views/AboutView.vue'
import ProfileView from './views/ProfileView.vue'
import './assets/main.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',        component: HomeView   },
    { path: '/about',   component: AboutView  },
    { path: '/profile', component: ProfileView }
  ]
})

createApp(App)
  .use(router)
  .use(
    createAuth0({
      domain:   import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience:     import.meta.env.VITE_AUTH0_AUDIENCE,
      },
      // ── FIX 1: Session nach Refresh erhalten ──────────────────
      // 'localstorage' speichert den Token im Browser — bleibt
      // nach F5 / Tab-Reload erhalten (Standard 'memory' verliert ihn).
      cacheLocation: 'localstorage',
      // Refresh-Token holt automatisch neue Access-Tokens, bevor sie
      // ablaufen — kein erneutes Login nötig.
      useRefreshTokens: true,
    })
  )
  .mount('#app')
