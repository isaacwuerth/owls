import { PropsWithChildren, useEffect, useState } from 'react'
import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material'
import { useRecoilValue } from 'recoil'
import { layoutState } from '../atoms/LayoutAtom'

export default function LayoutProvider({ children }: PropsWithChildren) {
  const layout = useRecoilValue(layoutState)
  const [theme, setTheme] = useState(createTheme())
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  useEffect(() => {
    if (layout.themeMode === 'system') {
      setTheme(
        createTheme({
          palette: {
            mode: prefersDarkMode ? 'dark' : 'light',
          },
        })
      )
      return
    }
    setTheme(
      createTheme({
        palette: {
          mode: layout.themeMode,
        },
      })
    )
  }, [layout])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
