import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BookmarkModal from '../components/BookmarkModal.vue'

describe('BookmarkModal.vue', () => {

  it('zeigt "Bookmark hinzufügen" im Add-Modus', () => {
    const wrapper = mount(BookmarkModal, {
      props: { bookmark: null, isEdit: false }
    })
    expect(wrapper.text()).toContain('Bookmark hinzufügen')
  })

  it('zeigt "Bookmark bearbeiten" im Edit-Modus', () => {
    const wrapper = mount(BookmarkModal, {
      props: {
        isEdit: true,
        bookmark: {
          id: 1, title: 'HTW Berlin', url: 'https://www.htw-berlin.de',
          description: '', tags: [], gelesen: false, favorit: false
        }
      }
    })
    expect(wrapper.text()).toContain('Bookmark bearbeiten')
  })

  it('emittiert close beim Klick auf Abbrechen', async () => {
    const wrapper = mount(BookmarkModal, {
      props: { bookmark: null, isEdit: false }
    })
    await wrapper.find('.btn-cancel').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('Save-Button ist deaktiviert wenn Titel und URL leer sind', () => {
    const wrapper = mount(BookmarkModal, {
      props: { bookmark: null, isEdit: false }
    })
    const saveBtn = wrapper.find('.btn-save')
    expect(saveBtn.attributes('disabled')).toBeDefined()
  })

})
