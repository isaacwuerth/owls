import Tracker from '@openreplay/tracker'

type Profiler = (name: string) => (fn: Function, thisArg?: any) => any

declare module '*.svg' {
  const content: any
  export default content
}

declare global {
  let tracker: Tracker
  let profiler: Profiler
}
