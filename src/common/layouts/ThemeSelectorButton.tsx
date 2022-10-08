import IconButton from '@mui/material/IconButton'
import { useRecoilState } from 'recoil'
import { themeModeState, ThemeMode } from '../../atoms/LayoutAtom'
import Brightness6Icon from '@mui/icons-material/Brightness6'
import { Menu, MenuProps, styled } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { ReactElement, useState, MouseEvent } from 'react'
import Brightness2Icon from '@mui/icons-material/Brightness2'
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh'
import SettingsIcon from '@mui/icons-material/Settings'
import MenuItem from '@mui/material/MenuItem'

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}))

const menuThemes: {
  [key in ThemeMode]: { icon: ReactElement; label: string }
} = {
  dark: {
    icon: <Brightness2Icon />,
    label: 'Dark',
  },
  light: {
    icon: <BrightnessHighIcon />,
    label: 'Light',
  },
  system: {
    icon: <SettingsIcon />,
    label: 'System',
  },
}

export function ThemeSelectorButton() {
  const [themeMode, setThemeMode] = useRecoilState(themeModeState)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleThemeClick = (selectedTheme: ThemeMode) => {
    setThemeMode(selectedTheme)
    handleClose()
  }

  return (
    <>
      <IconButton onClick={handleClick}>
        <Brightness6Icon />
      </IconButton>
      <StyledMenu open={open} onClose={handleClose} anchorEl={anchorEl}>
        {Object.entries(menuThemes).map(([key, value]) => (
          <MenuItem
            onClick={() => handleThemeClick(key as ThemeMode)}
            key={key}
            selected={themeMode === key}
          >
            {value.icon}
            {value.label}
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  )
}
