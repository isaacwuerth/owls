import { Timestamp } from 'firebase/firestore'

export function TimestampToDate(timestamp: Timestamp): Date {
  return timestamp.toDate()
}

export function DateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date)
}
