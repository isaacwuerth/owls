import React, { ReactElement, useState } from 'react'
import {
  AppBar,
  Box,
  Divider,
  Drawer,
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
  useTheme,
} from '@mui/material'

import IconButton from '@mui/material/IconButton'
import { NavItems } from '../../Nav'
import { Link, Outlet } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Logout,
  MenuRounded,
  Settings,
} from '@mui/icons-material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { AvatarCurrentUser } from '../../components/Profile/AvatarCurrentUser'
import { useRecoilValue } from 'recoil'
import { siteConfigAtom } from '../../atoms/SiteConfigAtom'
import { Logo } from '../Logo'

const drawerWidth = 240

interface AppBarMenuItem {
  name: string
  uri: string
  icon: ReactElement
}

const AppBarMenuItems: AppBarMenuItem[] = [
  {
    name: 'Profil',
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
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

function BasicLayout() {
  const theme = useTheme()
  const [open, setOpen] = useState<boolean>(false)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )
  const siteConfig = useRecoilValue(siteConfigAtom)
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const SpacingBox = styled(Box)(({ theme }) => ({
    ...theme.mixins.toolbar,
  }))

  const handleOpen = () => setOpen(!open)

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar sx={{ zIndex: 1201 }}>
        <Box>
          <Toolbar style={{ paddingLeft: 15 }}>
            <IconButton onClick={handleOpen}>
              {open ? <ChevronLeft /> : <MenuRounded />}
            </IconButton>
            <Logo width="30px" />
            <Typography
              variant="h6"
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
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
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <AvatarCurrentUser />
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
      <Box component="nav" sx={{ width: 0, flexShrink: { sm: 0 } }}>
        <Drawer
          open={open}
          anchor="left"
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          onClose={() => setOpen(false)}
        >
          <Toolbar />
          <DrawerHeader>
            <IconButton onClick={handleOpen}>
              {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {NavItems.map((text) => (
              <ListItem key={text.key} disablePadding>
                <ListItemButton component={Link} to={text.uri}>
                  <ListItemIcon>{text.icon}</ListItemIcon>
                  <ListItemText primary={text.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>

      <Box>
        <SpacingBox />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            padding: 1,
            width: (theme) => ` calc(100vw - ${theme.spacing(2)})`,
          }}
          // sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default BasicLayout
