/**
 * @fileoverview Auth0 Composable für die BookmarkIt-Anwendung.
 *
 * Kapselt die gesamte Auth0-Logik und stellt eine einheitliche
 * Schnittstelle für alle Komponenten bereit.
 *
 * Verwendung in Komponenten:
 * ```ts
 * const { user, isAuthenticated, login, logout, authFetch } = useAuth()
 * ```
 *
 * @module composables/useAuth
 * @author Mohamad Habachia, Ibrahim Hassan
 * @version 2.0
 * @since SoSe 2026
 */

import { useAuth0 } from '@auth0/auth0-vue'
import { computed } from 'vue'

/**
 * Composable für Auth0-Integration.
 *
 * Kapselt `useAuth0` und stellt folgende Funktionen bereit:
 * - Login / Logout via Auth0 Universal Login
 * - `authFetch()` — fetch-Wrapper mit automatischem JWT-Bearer-Token
 * - `userInitials` — berechnete Initialen für den Avatar
 *
 * @returns Objekt mit Auth-Zustand und Hilfsfunktionen
 */
export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently
  } = useAuth0()

  /**
   * Leitet den User zur Auth0 Universal Login-Seite weiter.
   * Nach erfolgreichem Login wird er zurück zur App (`redirect_uri`) geleitet.
   */
  function login(): void {
    loginWithRedirect()
  }

  /**
   * Meldet den User ab und leitet ihn zur App-Startseite weiter.
   * Der JWT-Token wird aus dem localStorage entfernt.
   */
  function logout(): void {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } })
  }

  /**
   * fetch-Wrapper mit automatischem JWT-Bearer-Token.
   *
   * Ersetzt direktes `fetch()` in allen Komponenten. Holt den aktuellen
   * Access-Token von Auth0 (ggf. erneuert via Refresh-Token) und setzt ihn
   * automatisch im `Authorization` Header.
   *
   * @param url - Die API-URL, z.B. `/api/bookmarks` oder `https://backend.onrender.com/api/bookmarks`
   * @param options - Optionale fetch-Optionen (method, body, etc.)
   * @returns Promise mit der fetch Response
   *
   * @example
   * // GET-Request
   * const response = await authFetch('/api/bookmarks')
   * const bookmarks = await response.json()
   *
   * @example
   * // POST-Request
   * const response = await authFetch('/api/bookmarks', {
   *   method: 'POST',
   *   body: JSON.stringify({ title: 'HTW Berlin', url: 'https://htw-berlin.de' })
   * })
   */
  async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await getAccessTokenSilently()
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    })
  }

  /**
   * Berechnete Initialen des eingeloggten Users für den Avatar.
   *
   * Logik:
   * 1. Name vorhanden → erste Buchstaben jedes Worts (z.B. "Mohamad Habachia" → "MH")
   * 2. Kein Name → erste 2 Zeichen der E-Mail-Adresse
   * 3. Nichts vorhanden → "?"
   *
   * Maximal 2 Zeichen, immer Großbuchstaben.
   */
  const userInitials = computed((): string => {
    const name = user.value?.name ?? user.value?.email ?? '?'
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })

  return {
    /** Das Auth0 User-Objekt mit name, email, picture, sub etc. */
    user,
    /** Gibt an ob der User eingeloggt ist */
    isAuthenticated,
    /** Gibt an ob Auth0 noch den Login-Status prüft (Ladescreen) */
    isLoading,
    /** Berechnete Initialen für den Avatar (max. 2 Zeichen) */
    userInitials,
    /** Leitet zu Auth0 Universal Login weiter */
    login,
    /** Meldet den User ab */
    logout,
    /** fetch-Wrapper mit automatischem JWT-Token */
    authFetch
  }
}
