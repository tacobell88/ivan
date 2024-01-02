import React, { useState } from "react";
import HeaderLoggedIn from "./HeaderLoggedIn";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Header() {
    const [loggedIn, setLoggedIn] = useState([]);

    const defaultTheme = createTheme();

    return (
      <ThemeProvider theme={defaultTheme}>
       <AppBar
        position="static"
        sx={{
            backgroundColor: '#038cfc', // Custom background color
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`
        }}
        >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit', marginRight: 'auto' }}>
            <Button color="inherit">
              TMS
            </Button>
          </RouterLink>
          <div style={{ flexGrow: 1 }}></div> {/* Spacer to push HeaderLoggedIn to the right */}
          <HeaderLoggedIn />
        </Toolbar>
      </AppBar>
      </ThemeProvider>
    )
}

export default Header;


{/*
import React, { useState } from "react";
import HeaderLoggedIn from "./HeaderLoggedIn";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function Header() {
    const [loggedIn, setLoggedIn] = useState([]);

    return (
       <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Company name
          </Typography>
          <nav>
            <Link
              variant="button"
              color="text.primary"
              href="#"
              sx={{ my: 1, mx: 1.5 }}
            >
              Features
            </Link>
            <Link
              variant="button"
              color="text.primary"
              href="#"
              sx={{ my: 1, mx: 1.5 }}
            >
              Enterprise
            </Link>
            <Link
              variant="button"
              color="text.primary"
              href="#"
              sx={{ my: 1, mx: 1.5 }}
            >
              Support
            </Link>
          </nav>
          <Button href="#" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
            )
        }
        
        export default Header;
        
*/}