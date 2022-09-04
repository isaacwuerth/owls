import { atom, selectorFamily } from 'recoil'
import { GeneralEvent } from '../model/GeneralEvent'

export const eventListState = atom<GeneralEvent[]>({
  key: 'eventListState',
  default: []
})

export const eventSelector = selectorFamily({
  key: 'sortedTodoList',
  get: (id: string) => ({ get }) => {
    const events = get(eventListState)
    return events.find(event => event.id === id)
  },
  set: (id: string) => ({ get, set }, newValue) => {
    if (!newValue) return
    const events = get(eventListState)
    const newEvents = [...events]
    // @ts-expect-error
    newEvents[newEvents.findIndex(e => e.id === id)] = newValue
    set(eventListState, newEvents)
  }
})
