import React, { useEffect, useState, Navigate } from "react";
import { useNavigate } from "react-router-dom";
import Page from "./Page";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuth } from "../assets/AuthContext";

import { Button, CssBaseline, TextField, Box, Container, createTheme, ThemeProvider } from '@mui/material/';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { isLoggedIn, setIsLoggedIn } = useAuth();
    console.log({isLoggedIn, setIsLoggedIn});

    const defaultTheme = createTheme();

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(username);
        console.log(password);

        try {
            const response = await axios.post('http://localhost:8000/login', {
                userId: username,
                password: password
            });
            if (response.data.success) {
              Cookies.set('token', response.data.token, { expires: 7 });
              Cookies.set('user', JSON.stringify(response.data.user), { expires: 7 });
              // Cookies.set('userRole', response.data.user.user_group, { expires: 7 }); // Store user role
              axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

              console.log('Logged in user roles:', response.data.user.user_group); // Log user roles

              setIsLoggedIn(true); // Update login state
              navigate('/home'); // Redirect to home
              // window.location.href = '/home';
              // <Navigate to="/home" />
            } else if (response.status === 401) {
                alert('Please enter username/password');
            }
        } catch (error) {
            alert('Invalid login credentials');
            console.error('Login error:', error);
        }
    }

    return (
    <Page title="Login">
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField 
              margin="normal" 
              required 
              fullWidth 
              id="username" 
              label="Username"
              name="username" 
              autoComplete="username" 
              autoFocus 
              onChange={(e) => setUsername(e.target.value)}/>
            <TextField 
              margin="normal"
              required 
              fullWidth 
              name="password" 
              label="Password" 
              type="password" 
              id="password" 
              autoComplete="off" 
              onChange={(e) => setPassword(e.target.value)}/>
            <Button type="submit" fullWidth variant="contained" 
                    sx={{ mt: 3, mb: 2 }} > Sign In </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </Page>
    )
}
export default Login