import { atom, selector } from 'recoil'
import { LocalStorage, storageEffect } from './effects/StorageEffect'

export type ThemeMode = 'dark' | 'light' | 'system'

interface LayoutState {
  drawerOpen: boolean
  themeMode: ThemeMode
}

export const layoutState = atom<LayoutState>({
  key: 'layout',
  default: {
    drawerOpen: false,
    themeMode: 'system',
  },
  effects: [storageEffect('owls.layout', new LocalStorage())],
})

export const drawerOpen = selector<boolean>({
  key: 'layout.drawerOpen',
  get: ({ get }) => get(layoutState).drawerOpen,
  set: ({ get, set }, newValue) =>
    set(layoutState, (oldLayout) => ({
      ...oldLayout,
      drawerOpen: newValue as boolean,
    })),
})

export const themeModeState = selector<ThemeMode>({
  key: 'layout.themeMode',
  get: ({ get }) => get(layoutState).themeMode,
  set: ({ set }, newValue) =>
    set(layoutState, (oldLayout) => ({
      ...oldLayout,
      themeMode: newValue as ThemeMode,
    })),
})
