import React, { useEffect, useState } from "react";
import Page from "./Page";
import axios from "axios";
import Cookies from "js-cookie";

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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
                // Assuming the JWT token is in response.data.token
                Cookies.set('token', response.data.token, { expires: 7 });
                // Optionally set user details in state for global access
                alert('Login Success');
            } else {
                alert('Login Failed');
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
            <TextField margin="normal" required fullWidth id="username" label="Username"
              name="username" autoComplete="username" autoFocus onChange={(e) => setUsername(e.target.value)}/>
            <TextField margin="normal" required fullWidth name="password" label="Password" 
                        type="password" id="password" autoComplete="off" onChange={(e) => setPassword(e.target.value)}/>
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