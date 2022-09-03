import addDays from 'date-fns/addDays'
import { atom } from 'recoil'
import { GeneralEvent } from '../model/GeneralEvent'
import { ParticipantState } from '../enum/ParticipantState'

const sampleData: GeneralEvent[] = [
  {
    id: 1,
    title: 'Event 1',
    start: new Date(),
    end: addDays(new Date(), 10),
    participants: [
      {
        id: 1,
        person: {
          firstName: 'John',
          lastName: 'Doe',
          id: '1',
          eMail: 'test@test.ch'
        },
        state: ParticipantState.OUTSTANDING
      },
      {
        id: 2,
        person: {
          firstName: 'John',
          lastName: 'Doe',
          id: '1',
          eMail: 'test@test.ch'
        },
        state: ParticipantState.WITHRESERVATION
      },
      {
        id: 3,
        person: {
          firstName: 'John',
          lastName: 'Doe',
          id: '1',
          eMail: 'test@test.ch'
        },
        state: ParticipantState.COMMITMENT
      },
      {
        id: 4,
        person: {
          firstName: 'John',
          lastName: 'Doe',
          id: '1',
          eMail: 'test@test.ch'
        },
        state: ParticipantState.REJECTED
      }
    ]
  }
]

export const eventListState = atom<GeneralEvent[]>({
  key: 'eventListState',
  default: sampleData
})

export const currentEventViewState = atom<GeneralEvent>({
  key: 'currentEventViewState',
  default: sampleData[0]
})
