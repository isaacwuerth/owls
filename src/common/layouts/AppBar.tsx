import { CSSObject, styled } from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import { Theme } from '@mui/material/styles'

const mdOpenMixin = (theme: Theme, drawerWidth: number): CSSObject => ({
  marginLeft: drawerWidth,
  width: `calc(100% - ${drawerWidth}px)`,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
})

const mdClosedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
})

interface AppBarProps extends MuiAppBarProps {
  open: boolean
  drawerWidth: number
}

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'displayVariant',
})<AppBarProps>(({ theme, drawerWidth, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  width: '100%',
  [theme.breakpoints.between('sm', 'lg')]: {
    ...(open && mdOpenMixin(theme, drawerWidth)),
    ...(!open && mdClosedMixin(theme)),
  },
}))
