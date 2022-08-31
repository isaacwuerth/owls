import React, { ReactElement } from 'react'
import {
  AppBar,
  Box,
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
  Typography
} from '@mui/material'
import { Logo } from '../Logo'
import IconButton from '@mui/material/IconButton'
import { NavItems } from '../../Nav'
import { Link } from 'react-router-dom'
import { Logout, Settings } from '@mui/icons-material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { ProfileAvatar } from '../ProfileAvatar'

const drawerWidth = 240

interface AppBarMenuItem {
  name: string
  uri: string
  icon: ReactElement
}

const AppBarMenuItems: AppBarMenuItem[] = [
  { name: 'Profil', uri: 'profile', icon: <AccountCircleIcon fontSize="small"/> },
  { name: 'Einstellungen', uri: 'settings', icon: <Settings fontSize="small"/> },
  { name: 'Logout', uri: 'logout', icon: <Logout fontSize="small"/> }
]

function BasicLayout ({ children }: React.PropsWithChildren) {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const SpacingBox = styled(Box)(({ theme }) => ({
    ...theme.mixins.toolbar
  }))

  return (
        <Box sx={{ display: 'flex' }}>
            <AppBar sx={{ zIndex: 1201 }}>
                <Box>
                    <Toolbar style={{ top: 0 }}>
                        <Logo/>
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
                              textDecoration: 'none'
                            }}
                        >
                            LOGO
                        </Typography>
                        <Box sx={{ flex: 1 }}/>
                        <Box>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <ProfileAvatar/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right'
                                }}
                                keepMounted
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right'
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {
                                    AppBarMenuItems.map((value, index) => (
                                        <MenuItem key={`appbar-menu-item-${index}`} component={Link} to={value.uri} onClick={handleCloseUserMenu}>
                                            <ListItemIcon>{value.icon}</ListItemIcon>
                                            {value.name}
                                        </MenuItem>
                                    ))
                                }

                            </Menu>
                        </Box>
                    </Toolbar>
                </Box>
            </AppBar>
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer variant="permanent" open
                        sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
                    <Toolbar/>
                    <List>
                        {NavItems.map((text, index) => (
                            <ListItem key={text.key} disablePadding>
                                <ListItemButton component={Link} to={text.uri}>
                                    <ListItemIcon>{text.icon}</ListItemIcon>
                                    <ListItemText primary={text.name}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <SpacingBox/>
                {children}
            </Box>
        </Box>
  )
}

export default BasicLayout
