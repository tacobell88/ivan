import React, { useState } from "react";
import HeaderLoggedIn from "./HeaderLoggedIn";
import { Link as RouterLink } from 'react-router-dom';

import {AppBar, Toolbar, Button, createTheme, ThemeProvider} from '@mui/material/';


function Header(props) {
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