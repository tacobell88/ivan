import React, { useEffect,useState } from "react";
import { Link as RouterLink } from 'react-router-dom'; // Import RouterLink
import Cookies from "js-cookie";
import { useAuth } from "../assets/AuthContext";
import axios from "axios";

import MuiLink from '@mui/material/Link'; // Rename to avoid naming conflict
import { Button, createTheme, ThemeProvider } from '@mui/material/';

function HeaderLoggedIn() {
    const { IsLoggedIn, setIsLoggedIn } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    // TRYING TO USE CHECKGROUP INSTEAD (WORKING)
    // useEffect(()=> {
    //   try {
    //     axios.post('http://localhost:8000/checkGroup', {
    //           user_group: 'admin'
    //     }).then((response)=> {
    //       setIsAdmin(true);
    //       console.log('Header Logged In are u working: ', response)
    //     }).catch( (error) => console.log(error) );
    //   //   if (response) {
    //   //     setIsAdmin(true);
    //   //   }
    //   } catch (error) {
    //     console.log(error.message);
    //   }
    // },[setIsLoggedIn]) 

    useEffect(() => {
      const checkAdmin = async() => {
        try {
          const response = await axios.post('http://localhost:8000/checkGroup', {
                    user_group: 'admin'
                  });
          console.log('response from checkAdmin in headerLoggedIn', response)
          if (response) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.log('Error from headerLoggedIn: ', error.message);
        }
      }
      checkAdmin();
    },[setIsLoggedIn])
      

    const defaultTheme = createTheme();

    const handleLogout = async () => {
      // Perform logout API call if necessary
      Cookies.remove('token');
      Cookies.remove('userRole');
      Cookies.remove('user');
      delete axios.defaults.headers.common['Authorization'];
      setIsLoggedIn(false);
      window.location.href = '/'; // Redirect to login page
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <nav>
            {isAdmin && (
              <MuiLink
                  component={RouterLink}
                  to="/user-management"
                  variant="button"
                  color="inherit"
                  sx={{ my: 1, mx: 1.5 }}
                >
                 User Management
                </MuiLink>
            )}
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
              }}
              onClick={handleLogout}>
                Log Out
            </Button>
        </ThemeProvider>
    );
}

export default HeaderLoggedIn