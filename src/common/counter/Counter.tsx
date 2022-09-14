import { useEffect, useState } from 'react'

import './Counter.sass'

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  difference: number
}

export const calculateTimeLeft = (date: Date): TimeLeft => {
  const now = new Date()
  const difference = date.getTime() - now.getTime()

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    difference,
  }
}

interface CounterProps {
  endDate: Date
}

export const Counter = ({ endDate }: CounterProps) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate))

  useEffect(() => {
    setTimeout(() => setTimeLeft(calculateTimeLeft(endDate)), 1000)
  }, [timeLeft])

  if (timeLeft.difference <= 0) return null

  return (
    <div className="counter">
      <div className="counter-item">
        <span className="value">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="label">Tage</span>
      </div>

      <div className="counter-item">
        <span className="value">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="label">Stunden</span>
      </div>

      <div className="counter-item">
        <span className="value">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="label">Minuten</span>
      </div>

      <div className="counter-item">
        <span className="value">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="label">Sekunden</span>
      </div>
    </div>
  )
}
