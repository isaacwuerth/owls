import { CSSObject, styled } from '@mui/material'
import { Theme } from '@mui/material/styles'
import MuiDrawer, { DrawerProps as MuiDrawerProps } from '@mui/material/Drawer'

const openedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

interface DrawerProps extends MuiDrawerProps {
  drawerWidth: number
}

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'drawerWidth',
})<DrawerProps>(({ theme, open, drawerWidth, variant }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  overflowX: 'hidden',
  '& .MuiDrawer-paper ': {
    width: drawerWidth,
  },
  ...(open &&
    variant === 'permanent' && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
  ...(!open &&
    variant === 'permanent' && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
}))
