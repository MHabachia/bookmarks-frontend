import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BookmarkItem from '../components/BookmarkItem.vue'

const mockBookmark = {
  id: 1,
  title: 'HTW Berlin',
  url: 'https://www.htw-berlin.de',
  description: 'Meine Uni',
  gelesen: false,
  favorit: false,
  tags: ['Studium', 'HTW'],
  ownerId: 'auth0|test123',
  createdAt: '2026-05-01T10:00:00'
}

describe('BookmarkItem.vue', () => {

  it('zeigt Titel, URL und Tags an', () => {
    const wrapper = mount(BookmarkItem, {
      props: { bookmark: mockBookmark }
    })
    expect(wrapper.text()).toContain('HTW Berlin')
    expect(wrapper.text()).toContain('htw-berlin.de')
    expect(wrapper.text()).toContain('Studium')
    expect(wrapper.text()).toContain('HTW')
  })

  it('emittiert toggle-favorit beim Klick auf Favorit-Button', async () => {
    const wrapper = mount(BookmarkItem, {
      props: { bookmark: mockBookmark }
    })
    // Fix: semantischer Selektor via title-Attribut statt fragiler Index
    await wrapper.find('[title*="Favorit"]').trigger('click')
    expect(wrapper.emitted('toggle-favorit')).toBeTruthy()
  })

  it('emittiert toggle-gelesen beim Klick auf Gelesen-Button', async () => {
    const wrapper = mount(BookmarkItem, {
      props: { bookmark: mockBookmark }
    })
    // Fix: semantischer Selektor via title-Attribut statt fragiler Index
    await wrapper.find('[title*="gelesen"]').trigger('click')
    expect(wrapper.emitted('toggle-gelesen')).toBeTruthy()
  })

  it('zeigt active-Klasse auf Favorit-Button wenn favorit=true', () => {
    const wrapper = mount(BookmarkItem, {
      props: { bookmark: { ...mockBookmark, favorit: true } }
    })
    // Fix: semantischer Selektor via title-Attribut
    expect(wrapper.find('[title*="Favoriten"]').classes()).toContain('active')
  })

})
