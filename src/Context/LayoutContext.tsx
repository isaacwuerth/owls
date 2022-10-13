import { PropsWithChildren, useEffect, useState } from 'react'
import {
  createTheme,
  CssBaseline,
  PaletteColorOptions,
  ThemeOptions,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material'
import { useRecoilValue } from 'recoil'
import { layoutState } from '../atoms/LayoutAtom'

declare module '@mui/material/styles' {
  interface PaletteOptions {
    tertiary?: PaletteColorOptions
  }
}

const themeOption: ThemeOptions = {
  palette: {
    tertiary: {
      main: '#fff',
      light: '#fff',
      dark: '#E6E6EB',
    },
    background: {
      default: '#eee',
      paper: '#fff',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'unset',
          backgroundImage: 'unset',
          backgroundColor: 'inherit',
          backdropFilter: 'blur(12px)',
        },
      },
      defaultProps: {
        color: 'inherit',
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {},
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '32px',
          boxShadow: 'unset',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12dp',
          boxShadow: 'unset',
        },
      },
      defaultProps: {
        sx: {
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'tertiary.dark' : 'tertiary.light',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'inherit',
          borderRight: 'none',
          boxShadow: 'none',
          backgroundImage: 'none',
        },
        root: {
          '& ul li a': {
            borderRadius: '32px',
          },
          '& ul li': {
            margin: 6,
            width: 'initial',
          },
        },
      },
    },
  },
}

export default function LayoutProvider({ children }: PropsWithChildren) {
  const layout = useRecoilValue(layoutState)
  const [theme, setTheme] = useState(createTheme())
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  useEffect(() => {
    if (layout.themeMode === 'system') {
      setTheme(
        createTheme({
          ...themeOption,
          palette: {
            mode: prefersDarkMode ? 'dark' : 'light',
            tertiary: {
              main: '#fff',
            },
          },
        })
      )
      return
    }
    setTheme(
      createTheme({
        palette: {
          mode: layout.themeMode,
          tertiary: {
            main: '#fff',
          },
        },
        ...themeOption,
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
