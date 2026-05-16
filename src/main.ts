/**
 * Einstiegspunkt der BookmarkIt Vue.js-Anwendung.
 *
 * Initialisiert die Vue-App, konfiguriert Vue Router und
 * hängt die Anwendung in den DOM-Einstiegspunkt (#app) ein.
 *
 * Ablauf:
 * 1. Vue Router mit einer Route (/) wird erstellt
 * 2. Vue-App wird mit App.vue als Wurzelkomponente erstellt
 * 3. Router wird registriert
 * 4. App wird in <div id="app"> (index.html) eingehängt
 */

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import './assets/main.css'

/**
 * Vue Router Instanz.
 *
 * Verwendet createWebHistory() für saubere URLs ohne Hash (#).
 * Aktuell definierte Routen:
 * - "/" → HomeView (Hauptansicht mit Bookmark-Liste)
 *
 * @type {import('vue-router').Router}
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView }
  ]
})

/**
 * Erstellt und startet die Vue-Anwendung.
 *
 * .use(router) — registriert Vue Router global,
 * macht <RouterView> und <RouterLink> in allen Komponenten verfügbar.
 *
 * .mount('#app') — ersetzt <div id="app"> in index.html
 * mit der gerenderten Vue-Anwendung.
 */
createApp(App)
  .use(router)
  .mount('#app')
