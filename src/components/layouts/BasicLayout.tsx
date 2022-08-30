import React from "react";
import {
    AppBar,
    Avatar,
    Box,
    Container,
    Menu,
    MenuItem, styled,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import {Logo} from "../Logo";
import IconButton from '@mui/material/IconButton';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];



function BasicLayout({children}: React.PropsWithChildren) {
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const SpacingBox = styled(Box)(({ theme }) => ({
        ...theme.mixins.toolbar,
    }));

    return (
        <>
            <AppBar>
                <Box>
                    <Toolbar style={{top: 0}}>
                        <Logo/>
                        <Typography
                            variant="h6"
                            component="a"
                            href="/"
                            sx={{
                                flexGrow: 1,
                                mr: 2,
                                display: {xs: 'none', md: 'flex'},
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            LOGO
                        </Typography>
                        <Box>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg"/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{mt: '45px'}}
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
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Box>
            </AppBar>
            <SpacingBox/>
            <Container sx={{marginTop: '50px'}}>
                {children}
            </Container>
        </>
    );
}

export default BasicLayout;
