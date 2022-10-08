import { atom, selector } from 'recoil'
import { LocalStorage, storageEffect } from './effects/StorageEffect'

interface LayoutState {
  drawerOpen: boolean
}

export const layoutState = atom<LayoutState>({
  key: 'layout',
  default: {
    drawerOpen: false,
  },
  effects: [storageEffect('owls.layout', new LocalStorage())],
})

export const drawerOpen = selector<boolean>({
  key: 'layout.drawerOpen',
  get: ({ get }) => {
    const layout = get(layoutState)
    return layout.drawerOpen
  },
  set: ({ get, set }, drawerOpen) => {
    const layout = get(layoutState)
    const newLayout: LayoutState = {
      ...layout,
      drawerOpen: Boolean(drawerOpen),
    }
    set(layoutState, newLayout)
  },
})
