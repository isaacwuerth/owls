import { styled } from '@mui/material'

interface MainContentProps {
  drawerWidth: number
  padding: number
  open: boolean
}

export const MainContent = styled('main')<MainContentProps>(
  ({ theme, padding: p, open, drawerWidth }) => ({
    width: `calc(100vw - ${theme.spacing(p * 2)})`,
    padding: theme.spacing(p),
    flexGrow: 1,
    [theme.breakpoints.only('xs')]: {
      marginLeft: open ? drawerWidth : 0,
    },
    [theme.breakpoints.between('sm', 'lg')]: {
      width: open
        ? `calc(100vw - ${theme.spacing(p * 2)} - ${drawerWidth}px )`
        : `calc(100vw - ${theme.spacing(p * 2)} - ${theme.spacing(8)} - 1px)`,
    },
    [theme.breakpoints.up('lg')]: {
      width: `calc(100vw - ${theme.spacing(p * 2)} - ${drawerWidth}px )`,
    },
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: open
        ? theme.transitions.duration.enteringScreen
        : theme.transitions.duration.leavingScreen,
    }),
  })
)
