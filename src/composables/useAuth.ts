/**
 * Composable für Auth0-Integration.
 *
 * Kapselt useAuth0 und stellt authFetch() bereit —
 * ein fetch-Wrapper der automatisch den JWT-Bearer-Token mitsetzt.
 *
 * Verwendung in Komponenten:
 *   const { user, isAuthenticated, login, logout, authFetch } = useAuth()
 *
 * @module composables/useAuth
 */

import { useAuth0 } from '@auth0/auth0-vue'
import { computed } from 'vue'

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently
  } = useAuth0()

  /** Einloggen — leitet zu Auth0 Universal Login weiter */
  function login() {
    loginWithRedirect()
  }

  /** Ausloggen — leitet zurück zur App-Startseite */
  function logout() {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } })
  }

  /**
   * fetch-Wrapper mit automatischem JWT-Token.
   * Ersetzt direktes fetch() in BookmarkList.vue.
   *
   * @example
   * const data = await authFetch('/api/bookmarks')
   * const result = await authFetch('/api/bookmarks', { method: 'POST', body: JSON.stringify(bookmark) })
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

  /** Initialen für Avatar (z.B. "MH" aus "Mohamad Habachia") */
  const userInitials = computed(() => {
    const name = user.value?.name ?? user.value?.email ?? '?'
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })

  return {
    user,
    isAuthenticated,
    isLoading,
    userInitials,
    login,
    logout,
    authFetch
  }
}
