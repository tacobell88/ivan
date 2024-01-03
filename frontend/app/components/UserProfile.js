import React, { useState, useEffect } from "react";
import { TextField, Button, Paper, Typography, Box } from '@mui/material/';

function UserProfile() {
    // Simulated user data fetched from the API
    const loggedInUserData = {
        id: 1, 
        username: 'test2', 
        password: 'test', 
        email: 'test', 
        userGroup: 'dev,pl,admin', 
        userStatus: 'active'
    };

    // State for user data and edit mode
    const [userData, setUserData] = useState(loggedInUserData);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        // Fetch user data from the API and update the state
        // Example data fetching:
        // setUserData(fetchedUserData);
    }, []);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = () => {
        setEditMode(false);
        // API call to update user data
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
