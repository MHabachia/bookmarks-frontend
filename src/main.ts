/**
 * @fileoverview Einstiegspunkt der BookmarkIt Vue.js-Anwendung.
 *
 * Initialisiert die Vue-App mit allen Plugins:
 * - Vue Router für client-seitiges Routing
 * - Auth0 Plugin für JWT-Authentifizierung
 *
 * Auth0-Konfiguration:
 * - `cacheLocation: 'localstorage'` → Token überlebt Seiten-Reload (Standard 'memory' verliert ihn)
 * - `useRefreshTokens: true` → holt neue Access-Tokens automatisch bevor sie ablaufen
 *
 * Routen:
 * - `/`        → HomeView (Bookmark-Liste)
 * - `/about`   → AboutView (Projektinformationen)
 * - `/profile` → ProfileView (User-Profil & Statistiken)
 *
 * @module main
 * @author Mohamad Habachia, Ibrahim Hassan
 * @version 2.1
 * @since SoSe 2026
 */

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createAuth0 } from '@auth0/auth0-vue'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import AboutView from './views/AboutView.vue'
import ProfileView from './views/ProfileView.vue'
import './assets/main.css'

/**
 * Vue Router Instanz mit HTML5 History Mode.
 * Alle Pfade werden von index.html abgefangen (SPA-Routing via _redirects auf Render).
 */
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
      /** Auth0 Domain aus Umgebungsvariable VITE_AUTH0_DOMAIN */
      domain:   import.meta.env.VITE_AUTH0_DOMAIN,
      /** Auth0 Client ID aus Umgebungsvariable VITE_AUTH0_CLIENT_ID */
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      authorizationParams: {
        /** Nach Login zurück zur App-Startseite leiten */
        redirect_uri: window.location.origin,
        /** API Identifier aus Umgebungsvariable VITE_AUTH0_AUDIENCE */
        audience:     import.meta.env.VITE_AUTH0_AUDIENCE,
      },
      /**
       * Token im localStorage speichern statt im Arbeitsspeicher.
       * Dadurch bleibt die Session nach F5 / Tab-Reload erhalten.
       */
      cacheLocation: 'localstorage',
      /**
       * Refresh-Tokens aktivieren — Auth0 holt automatisch neue Access-Tokens
       * bevor sie ablaufen. Kein erneutes Login nach Token-Ablauf nötig.
       */
      useRefreshTokens: true,
    })
  )
  .mount('#app')
