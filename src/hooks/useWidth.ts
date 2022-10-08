import { Breakpoint, useMediaQuery, useTheme } from '@mui/material'
import { Theme } from '@mui/material/styles'

export const useWidth = (): Breakpoint => {
  const theme: Theme = useTheme()
  const keys: readonly Breakpoint[] = [...theme.breakpoints.keys].reverse()
  return keys.reduce((previousValue, currentValue) => {
    const isCurrentRange = useMediaQuery(theme.breakpoints.only(currentValue))
    return isCurrentRange ? currentValue : previousValue
  }, 'xs')
}
