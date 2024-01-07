import React, { useState, useEffect } from "react";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Stack, Grid } from '@mui/material/';
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import { useContext } from "react";
import { UserManagementContext } from "../assets/UserMgntContext";
import { useAuth } from "../assets/AuthContext";

function CreateUser() {
    const [userData, setUserData] = useState({ username: '', password: '', email: '', userGroups: [] });
    const [groups, setGroups] = useState([]);
    const { IsLoggedIn, setIsLoggedIn } = useAuth();

    const { refreshUserData } = useContext(UserManagementContext);

    useEffect(() => {
        // API call to fetch user group data
        const fetchGroups = async () => {
            try {
                const response = await axios.get('http://localhost:8000/users/getAllRoles');
                const groupData = response.data.message.map(group => group.user_group);
                setGroups(groupData);
            } catch (error) {
                console.error('Error fetching group data:', error);
                // Handle errors as appropriate
            }
        };
        fetchGroups();

    }, [refreshUserData]);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleDelete = (valueToDelete) => {
        // This function will be called when a chip's delete icon is clicked
        setUserData(prevState => ({
            ...prevState,
            userGroups: prevState.userGroups.filter(group => group !== valueToDelete)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Aligning the data structure with backend expectations
        const submitData = {
            userId: userData.username,  // Assuming 'username' in frontend corresponds to 'userId' in backend
            password: userData.password,
            email: userData.email,
            user_group: userData.userGroups.join(',') // Join userGroups with a comma
        };
        try {
            const response = await axios.post('http://localhost:8000/users/createUser', submitData);
            console.log('User creation response:', response.data);
            // Handle response and reset form or give feedback to user
        } catch (error) {
            console.error('Error creating user:', error);
            // Handle error response
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
                    <Grid item>
                        <TextField
                            name="username"
                            label="Username"
                            variant="outlined"
                            size="small"
                            onChange={handleChange}
                            style={{ width: 150 }} // Set specific width
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            name="password"
                            label="Password"
                            variant="outlined"
                            type="password"
                            size="small"
                            onChange={handleChange}
                            style={{ width: 150 }} // Set specific width
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            name="email"
                            label="Email"
                            variant="outlined"
                            type="email"
                            size="small"
                            onChange={handleChange}
                            style={{ width: 150 }} // Set specific width
                        />
                    </Grid>
                    <Grid item>
                    <FormControl variant="outlined" size="small" fullWidth>
                            <InputLabel>User Group</InputLabel>
                            <Select
                                multiple
                                name="userGroups"
                                value={userData.userGroups}
                                onChange={handleChange}
                                input={<OutlinedInput label="User Group" />}
                                renderValue={(selected) => (
                                    <Stack direction="row" spacing={1}>
                                        {selected.map((value) => (
                                            <Chip
                                                key={value}
                                                label={value}
                                                deleteIcon={<CancelIcon />}
                                                onDelete={() => handleDelete(value)}
                                                onMouseDown={(event) => event.stopPropagation()} // Prevents Select dropdown from closing
                                            />
                                        ))}
                                    </Stack>
                                )}
                            >
                                {groups.map((group) => (
                                    <MenuItem key={group} value={group}>
                                        {group}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            style={{ width: 100 }}> {/* Set specific width */}
                            Create 
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}

export default CreateUser