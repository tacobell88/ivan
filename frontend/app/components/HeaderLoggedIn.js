import React from "react";
import { Link as RouterLink } from 'react-router-dom'; // Import RouterLink

import MuiLink from '@mui/material/Link'; // Rename to avoid naming conflict
import { AppBar, Toolbar, Typography, Button, createTheme, ThemeProvider } from '@mui/material/';

function HeaderLoggedIn() {
    const defaultTheme = createTheme();

    return (
        <ThemeProvider theme={defaultTheme}>
            <nav>
                <MuiLink
                  component={RouterLink}
                  to="/user-management"
                  variant="button"
                  color="inherit"
                  sx={{ my: 1, mx: 1.5 }}
                >
                 User Management
                </MuiLink>
                <MuiLink
                  component={RouterLink}
                  to="/user-profile"
                  variant="button"
                  color="inherit"
                  sx={{ my: 1, mx: 1.5 }}
                >
                  My Profile
                </MuiLink>
            </nav>
            <Button 
              component={RouterLink} 
              to="/logout" 
              variant="outlined" 
              sx={{ 
                my: 1, 
                mx: 1.5, 
                color: 'black', // Text color
                backgroundColor: 'white', // Background color
                '&:hover': {
                  backgroundColor: '#f5f5f5', // Light grey background on hover
                  color: 'black',
                }
              }}>
                Log Out
            </Button>
        </ThemeProvider>
    );
}

export default HeaderLoggedIn


{/*
import React from "react";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function HeaderLoggedIn () {

    const defaultTheme = createTheme();

    return (
        <ThemeProvider theme={defaultTheme}>
        <nav>
            <Link
              variant="button"
              color="text.primary"
              href="#"
              sx={{ my: 1, mx: 1.5 }}
            >
             User Management
            </Link>
            <Link
              variant="button"
              color="text.primary"
              href="#"
              sx={{ my: 1, mx: 1.5 }}
            >
              My Profile
            </Link>
        </nav>
            <Button href="#" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                Sign Out
            </Button>
        </ThemeProvider>
    )
}

export default HeaderLoggedIn
*/}