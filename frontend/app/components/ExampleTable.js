import React, { useState, useEffect } from "react";

// importing neccessary components from MUI 
import {
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Chip,
    Stack
} from '@mui/material/';

import CancelIcon from "@mui/icons-material/Cancel";

// Initial hardcoded data for the table
const initialData = [
    { id: 1, username: 'test', password: 'test', email: 'test', userGroup: 'dev,pl,admin', userStatus: 'active' },
    { id: 2, username: 'test2', password: 'test2', email: 'test2', userGroup: 'dev,pl', userStatus: 'active' },
    { id: 3, username: 'test3', password: 'test3', email: 'test3', userGroup: 'dev,pl,admin', userStatus: 'active' }
];

// Hardcoded data for user groups, simulating data that might come from an API
const dummyGroupData = [
    { "user_group": "admin" }, 
    { "user_group": "dev" }, 
    { "user_group": "pl" }, 
    { "user_group": "pm" }
];

function ExampleTable() {
    const [data, setData] = useState(initialData);
    const [editIdx, setEditIdx] = useState(-1);
    const [groups, setGroups] = useState([]); // State to store groups from the API
    
    useEffect(() => {
        // Simulating fetching data from API
        const fetchedGroups = dummyGroupData.map(group => group.user_group);
        setGroups(fetchedGroups);
    }, []);
    
     // Function to start editing a row
    const startEdit = (id) => {
        setEditIdx(id);
    };

    // Function to stop editing a row (save changes)
    const stopEdit = () => {
        setEditIdx(-1);
    };
    
    // Function to handle changes in multi-select component (user groups)
    const handleChangeMultiSelect = (id, value) => {
        const newData = data.map((item) => {
            if (item.id === id) {
                // Join the array with a comma and no spaces
                return { ...item, userGroup: value.join(',') };
            }
            return item;
        });
        setData(newData);
    };

    // Function to handle deleting a selected user group
    const handleDelete = (id, valueToDelete, event) => {
        // Prevent the default event handling by the Select component
        event.stopPropagation();
    
        const newData = data.map((item) => {
            if (item.id === id) {
                const updatedUserGroups = item.userGroup.split(',').filter(group => group !== valueToDelete).join(',');
                return { ...item, userGroup: updatedUserGroups };
            }
            return item;
        });
        setData(newData);
    };

    // General function to handle changes in text fields
    const handleChange = (e, name, id) => {
        const newData = data.map((item) => {
            if (item.id === id) {
                return { ...item, [name]: e.target.value };
            }
            return item;
        });
        setData(newData);
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="caption table">
                <TableHead>
                    <TableRow>
                        <TableCell><b>Username</b></TableCell>
                        <TableCell align="right"><b> Password </b></TableCell>
                        <TableCell align="right"><b>Email</b></TableCell>
                        <TableCell align="right"><b>User Group</b></TableCell>
                        <TableCell align="right"><b>User Status</b></TableCell>
                        <TableCell align="right"><b>Edit</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {/* Mapping over each row in the data to create table rows */}
                    {data.map((row) => (
                        <TableRow key={row.id}>
                        {/* Mapping over each key in the row object to create table cells */}
                            {Object.keys(row).map((key) => {
                                if (key !== "id") {
                                    return (
                                        <TableCell key={key} align={key === 'username' ? 'left' : 'right'}>
                                        {/* Conditional rendering for different cell types based on edit mode and cell content
                                            and render logic for different cells */}
                                            {editIdx === row.id && key === 'userStatus' ? (
                                                <FormControl fullWidth>
                                                    <Select
                                                        value={row.userStatus}
                                                        onChange={(e) => handleChange(e, key, row.id)}
                                                        label="User Status"
                                                    >
                                                        <MenuItem value="active">Active</MenuItem>
                                                        <MenuItem value="disabled">Disabled</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            ) : editIdx === row.id && key === 'userGroup' ? (
                                                <FormControl fullWidth>
                                                <Select
                                                multiple
                                                value={row.userGroup.split(',').filter(group => group)} // Filter out empty strings
                                                onChange={(e) => handleChangeMultiSelect(row.id, e.target.value)}
                                                input={<OutlinedInput />}
                                                size="small"
                                                renderValue={(selected) => {
                                                    // Check if the selected array is empty and return null or an empty component
                                                    if (selected.length === 0) {
                                                        return null;
                                                    }
                                                    return (
                                                        <Stack gap={1} direction="row" flexWrap="wrap">
                                                            {selected.map((value) => (
                                                                <Chip
                                                                    key={value}
                                                                    label={value}
                                                                    onDelete={(event) => handleDelete(row.id, value, event)}
                                                                    deleteIcon={<CancelIcon onMouseDown={(event) => event.stopPropagation()} />}
                                                                />
                                                            ))}
                                                        </Stack>
                                                    );
                                                }}
                                            >
                                                {groups.map((group) => (
                                                    <MenuItem key={group} value={group}>
                                                        {group}
                                                    </MenuItem>
                                                ))}
                                                </Select>
                                                </FormControl>
                                            ) : editIdx === row.id ? (
                                                <TextField
                                                    value={row[key]}
                                                    onChange={(e) => handleChange(e, key, row.id)}
                                                    size="small"
                                                />
                                            ) : (
                                                row[key]
                                            )}
                                        </TableCell>
                                    );
                                }
                                return null;
                            })}
                            {/* Cell for Edit/Save button */}
                            <TableCell align="right">
                                {editIdx === row.id ? (
                                    <Button onClick={stopEdit} color="primary">Save</Button>
                                ) : (
                                    <Button onClick={() => startEdit(row.id)} color="primary">Edit</Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ExampleTable