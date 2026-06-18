import { describe, it, expect, vi, beforeEach } from 'vitest'

// Auth0 SDK mocken — kein echter Auth0-Aufruf in Tests
vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    user: { value: { name: 'Mohamad Habachia', email: 'mo@bookmarkit.de', picture: null } },
    isAuthenticated: { value: true },
    isLoading: { value: false },
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
    getAccessTokenSilently: vi.fn().mockResolvedValue('mock-jwt-token')
  })
}))

import { useAuth } from '../composables/useAuth'

describe('useAuth composable', () => {

  it('berechnet Initialen aus vollem Namen korrekt', () => {
    const { userInitials } = useAuth()
    expect(userInitials.value).toBe('MH')
  })

  it('authFetch setzt Authorization Header', async () => {
    const { authFetch } = useAuth()

    // fetch mocken
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    } as Response)

    await authFetch('/api/bookmarks')

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/bookmarks',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer mock-jwt-token'
        })
      })
    )
  })

  it('authFetch setzt Content-Type Header', async () => {
    const { authFetch } = useAuth()

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({})
    } as Response)

    await authFetch('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test' })
    })

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/bookmarks',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    )
  })

  it('isAuthenticated ist true nach Login', () => {
    const { isAuthenticated } = useAuth()
    expect(isAuthenticated.value).toBe(true)
  })

})
