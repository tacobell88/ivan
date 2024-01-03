import axios from "axios";
import React, { useState } from "react";
import { TextField, Button, Grid } from '@mui/material/';

export default function CreateGroup() {
    const [groupName, setGroupName] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/users/createRole', {
                user_group: groupName
            });
            alert('User added into database');
        } catch (error) {
            alert('Invalid group');
            if (error.response) {
                console.log(error.response.data);
            } else if (error.request) {
                console.log(error.request);
            } else if (error.message) {
                console.log(error.message);
            }
        }
    }

    return (
        <div style={{ textAlign: 'right', padding: '20px', marginTop:20}}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} justifyContent="flex-end">
                    <Grid item>
                        <TextField
                            label="Group Name"
                            variant="outlined"
                            type="text"
                            placeholder="Enter a group"
                            autoComplete="off"
                            size = "small"
                            style={{ width: 150 }}
                            onChange={e => setGroupName(e.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        <Button 
                            type="submit"
                            variant="contained" 
                            color="primary"  
                            style={{ width: 100 }}
                        >
                            Create 
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}
