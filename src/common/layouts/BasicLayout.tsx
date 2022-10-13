import React, { ReactElement, useEffect } from 'react'
import {
  Box,
  Breakpoint,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import IconButton from '@mui/material/IconButton'
import { NavItems } from '../../Nav'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Logout,
  MenuRounded,
  Settings,
} from '@mui/icons-material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { AvatarCurrentUser } from '../../components/Profile/AvatarCurrentUser'
import { useRecoilState, useRecoilValue } from 'recoil'
import { siteConfigAtom } from '../../atoms/SiteConfigAtom'
import { Logo } from '../Logo'
import { Protected } from '../../Context/AuthorizationContext'
import { AppBar } from './AppBar'
import { Drawer } from './Drawer'
import { MainContent } from './MainContent'
import { useWidth } from '../../hooks/useWidth'
import { drawerOpen } from '../../atoms/LayoutAtom'
import { ThemeSelectorButton } from './ThemeSelectorButton'

const drawerWidth = 240

interface AppBarMenuItem {
  name: string
  uri: string
  icon: ReactElement
}

const AppBarMenuItems: AppBarMenuItem[] = [
  {
    name: 'Profil ',
    uri: 'profile',
    icon: <AccountCircleIcon fontSize="small" />,
  },
  {
    name: 'Einstellungen',
    uri: 'settings',
    icon: <Settings fontSize="small" />,
  },
  { name: 'Logout', uri: 'logout', icon: <Logout fontSize="small" /> },
]

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}))

const drawerVariants: {
  [key in Breakpoint]: 'permanent' | 'persistent' | 'temporary'
} = {
  xs: 'temporary',
  sm: 'permanent',
  md: 'permanent',
  lg: 'permanent',
  xl: 'permanent',
}

function BasicLayout() {
  const theme = useTheme()
  const location = useLocation()
  const [open, setOpen] = useRecoilState(drawerOpen)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )
  const siteConfig = useRecoilValue(siteConfigAtom)
  const breakpoint = useWidth()
  const breakpointGreaterLg = useMediaQuery(theme.breakpoints.up('lg'))

  useEffect(() => {
    if (breakpoint === 'lg') setOpen(false)
  }, [breakpoint])

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const SpacingBox = styled(Box)(({ theme }) => ({
    ...theme.mixins.toolbar,
  }))

  const handleOpen = () => {
    setOpen(!open)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  function isCurrentLocation(navItemUri: string) {
    if (navItemUri === '/') return location.pathname === '/'
    return location.pathname.startsWith(navItemUri)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar open={open} drawerWidth={drawerWidth}>
        <Box>
          <Toolbar style={{ paddingLeft: 15 }}>
            <Collapse orientation="horizontal" in={!breakpointGreaterLg}>
              <IconButton onClick={handleOpen}>
                <MenuRounded />
              </IconButton>
            </Collapse>
            <Logo width="30px " />
            <Typography
              variant="h6"
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', sm: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {siteConfig.name}
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Box>
              <ThemeSelectorButton />
              <Tooltip title="Open settings ">
                <IconButton onClick={handleOpenUserMenu}>
                  <AvatarCurrentUser
                    sx={{ width: 24, height: 24, fontSize: 14 }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {AppBarMenuItems.map((value, index) => (
                  <MenuItem
                    key={`appbar-menu-item-${index}`}
                    component={Link}
                    to={value.uri}
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>{value.icon}</ListItemIcon>
                    {value.name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Box>
      </AppBar>
      <Drawer
        open={breakpointGreaterLg || open}
        anchor="left"
        variant={drawerVariants[breakpoint]}
        onClose={handleDrawerClose}
        drawerWidth={drawerWidth}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </DrawerHeader>
        <List>
          {NavItems.map((navItem) => (
            <Protected key={navItem.key} subject={navItem.permission?.subject}>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  component={Link}
                  to={navItem.uri}
                  sx={{
                    px: 2.5,
                    justifyContent:
                      breakpointGreaterLg || open ? 'initial ' : 'center',
                  }}
                  selected={isCurrentLocation(navItem.uri)}
                  onClick={handleDrawerClose}
                >
                  <ListItemIcon
                    sx={{
                      justifyContent: 'center',
                      mr: breakpointGreaterLg || open ? 3 : 'auto',
                    }}
                  >
                    {navItem.icon}
                  </ListItemIcon>
                  <Collapse
                    orientation="horizontal"
                    in={breakpointGreaterLg || open}
                  >
                    <ListItemText primary={navItem.name} />
                  </Collapse>
                </ListItemButton>
              </ListItem>
            </Protected>
          ))}
        </List>
      </Drawer>
      <Box>
        <SpacingBox />
        <MainContent padding={1} drawerWidth={drawerWidth} open={open}>
          <Outlet />
        </MainContent>
      </Box>
    </Box>
  )
}

export default BasicLayout
