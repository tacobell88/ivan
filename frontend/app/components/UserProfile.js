import React, { useEffect, useState } from "react";
import { TextField, Button, Paper, Typography, Box } from '@mui/material/';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

function UserProfile() {
    // Retrieve user data from cookies
    const [editMode, setEditMode] = useState(false);
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        username: ''
    });

    // ******* FIND A WAY TO GET USERNAME WITHOUT STORING IT IN COOKIES
    useEffect(()=> {
        async function getUser() {
            try {
                console.log('Running user profile useEffect to get user data')
                const response = await axios.get('http://localhost:8000/users/userProfile', {})
                console.log('response from getUsers in UserProfile: ',response);
                if (response.data.success) {
                    setUserData({
                        email : response.data.results.email,
                        password : '',
                        username : response.data.results.username
                    })
                }
            } catch (error) {
                console.log(error)
                console.log('Unable to find user');
            }
        }
        getUser();
    }, [])

    console.log('This is user data from user profile page: ',userData);

    // const userDataFromCookies = JSON.parse(Cookies.get('user') || '{}');
    // const [userData, setUserData] = useState({
    //     email: userDataFromCookies.email || '',
    //     password: '',
    //     username: userDataFromCookies.username || ''
    // });

    

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = async () => {
        setEditMode(false);
        try {
            const updatedData = {
                email: userData.email,
                // If password is empty, don't include it in the payload
                password: userData.password || null
            };
            await axios.post('http://localhost:8000/users/updateUser', updatedData);
            alert('User profile updated');
        } catch (error) {
            console.error('Error updating user profile:', error);
            alert('Error updating profile: ' + (error.response?.data?.message || error.message));
        } finally {
            // Reset password field after save attempt (success or fail)
            setUserData({ ...userData, password: '' });
        }
    };

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    return (
        <Paper style={{ padding: 20, maxWidth: 400, margin: "auto", marginTop :50}}>
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                <Typography variant="h6" style={{ marginBottom: 20 }}>
                    {userData.username}
                </Typography>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    disabled={!editMode}
                    style={{ marginBottom: 20 }}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    disabled={!editMode}
                    style={{ marginBottom: 20 }}
                />
                {editMode ? (
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                ) : (
                    <Button variant="contained" color="primary" onClick={handleEdit}>
                        Edit
                    </Button>
                )}
            </Box>
        </Paper>
    );
}

export default UserProfile;
