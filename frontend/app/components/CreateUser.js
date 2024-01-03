import React, { useState, useEffect } from "react";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Stack, Box, Grid } from '@mui/material/';
import CancelIcon from "@mui/icons-material/Cancel";

function CreateUser() {
    const [userData, setUserData] = useState({ username: '', password: '', email: '', userGroups: [] });
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        // Simulating fetching group data from API
        const fetchedGroups = ["admin", "dev", "pl", "pm"]; // Replace with actual API call
        setGroups(fetchedGroups);
    }, []);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // API call to create user
        // Example: axios.post('api_endpoint', userData);
        console.log('Submitted Data:', userData);
        // Reset form or give feedback to user
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
                        <FormControl variant="outlined" size="small"> {/* Set specific width */}
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
                                            <Chip key={value} label={value} deleteIcon={<CancelIcon />} onDelete={() => {
                                                setUserData(prevState => ({
                                                    ...prevState,
                                                    userGroups: prevState.userGroups.filter(group => group !== value)
                                                }));
                                            }} />
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