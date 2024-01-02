import React, { useEffect, useState } from "react";
import Page from "./Page";
import axios from "axios";

function Login () {
    const [username, setUsername] = useState([])
    const [password, setPassword] = useState([])

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:8000/login', {
                userId : username, 
                password: password
            })
            alert('Login Success')
            console.log(response.data)
        } catch (error) {
            alert('Invalid login credentials')
            if (error.response){
                    console.log(error.response.data)
                }else if(error.request){
                    console.log(error.request)
                }else if(error.message){
                    console.log(error.message)
                }
        }
    }
    return (
    <Page title="Login">
        <div className="row justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="col-lg-4">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username-register" className="text-muted mb-1">
                            <small>Username</small>
                        </label>
                        <input id="username-register" name="username" className="form-control" type="text"
                            placeholder="Enter username" autoComplete="off" onChange={e => setUsername(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password-register" className="text-muted mb-1">
                            <small>Password</small>
                        </label>
                        <input id="password-register" name="password" className="form-control" type="password"
                            placeholder="Enter password" onChange={e => setPassword(e.target.value)}/>
                    </div>
                    <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    </Page>
    )
}
export default Login

{/* import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
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
              name="username" autoComplete="username" autoFocus />
            <TextField margin="normal" required fullWidth name="password" label="Password" 
                        type="password" id="password" autoComplete="current-password" />
            <Button type="submit" fullWidth variant="contained" 
                    sx={{ mt: 3, mb: 2 }} > Sign In </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
} */}