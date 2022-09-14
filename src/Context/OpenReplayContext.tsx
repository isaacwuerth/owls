import { createContext, PropsWithChildren, useContext } from 'react'
import Tracker, { Options } from '@openreplay/tracker'
import trackerAssist from '@openreplay/tracker-assist'
import trackerProfiler from '@openreplay/tracker-profiler'
import trackerAxios from '@openreplay/tracker-axios'
import trackerFetch from '@openreplay/tracker-fetch'

type Profiler = (name: string) => (fn: Function, thisArg?: any) => any
export const OpenReplayContext = createContext<Tracker | null>(null)
export const OpenReplayProfilerContext = createContext<Profiler | null>(null)
let tracker: Tracker
let profiler: Profiler

export default function OpenReplayProvider (props: PropsWithChildren<Options>) {
  if (process.env.NODE_ENV !== 'production') { return (<>{props.children}</>) }
  if (!tracker) {
    tracker = new Tracker(props)
    tracker.use(trackerAxios())
    tracker.use(trackerAssist())
    profiler = tracker.use(trackerProfiler())
    const fetch = tracker.use(trackerFetch())
    // @ts-expect-error
    global.fetch = fetch
    console.log('Enabled OpenReplay')
  }
  return (
    <OpenReplayContext.Provider value={tracker}>
      <OpenReplayProfilerContext.Provider value={profiler}>
        {props.children}
      </OpenReplayProfilerContext.Provider>
    </OpenReplayContext.Provider>
  )
}

export const useOpenReplay = () => {
  const context = useContext(OpenReplayContext)
  if (context === undefined) {
    throw new Error(
      'useOpenReplay must be used within a OpenReplayProvider.Provider'
    )
  }
  return context as Tracker
}

export const useOpenReplayProfiler = () => {
  const context = useContext(OpenReplayProfilerContext)
  if (context === undefined) {
    throw new Error(
      'useOpenReplayProfiler must be used within a OpenReplayProvider.Provider'
    )
  }
  return context as Profiler
}
