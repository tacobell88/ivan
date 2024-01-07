import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, Select, MenuItem, OutlinedInput, Chip, Stack } from '@mui/material/';
import CancelIcon from "@mui/icons-material/Cancel";
import { UserManagementContext } from "../assets/UserMgntContext";
import { useAuth } from "../assets/AuthContext";

function ExampleTable() {
  const [data, setData] = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [groups, setGroups] = useState([]);
  const { refreshData, setRefreshData } = useContext(UserManagementContext);
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdmin = async() => {
      try {
        const response = await axios.post('http://localhost:8000/checkGroup', {
                  user_group: 'admin'
                });
        console.log('response from checkAdmin in ExampleTable;', response)
        if (response) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.log('Error from ExampleTable: ', error.message);
      }
    }
    checkAdmin();
  },[setIsLoggedIn])

  useEffect(() => {
    const fetchUserData = async () => {
        try {
          const response = await axios.get('http://localhost:8000/users/getUsers');
          console.log('This is fetched users data: ',response.data.message)
          setData(response.data.message.map(user => ({
            ...user,
            // If user_group is null, initialize as an empty string
            user_group: user.user_group || '',
            password: '' // Initialize password for each user
          })));
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
  }, [refreshData, setIsAdmin]);

  useEffect(() => {
      const fetchGroupData = async () => {
          try {
              const groupResponse = await axios.get('http://localhost:8000/users/getAllRoles');
              setGroups(groupResponse.data.message.map(group => group.user_group));
          } catch (error) {
              console.error('Error fetching group data:', error);
          }
      };
      fetchGroupData();
  }, [refreshData, setIsAdmin]);

  const startEdit = (id) => {
      setEditIdx(id);
  };

  const stopEdit = () => {
      setEditIdx(null);
  };

  const handleChange = (e, name, id) => {
    const newData = data.map((item) => {
        if (item.id === id) {
          // Replace null or undefined with an empty string
          const newValue = e.target.value !== null ? e.target.value : '';
          return { ...item, [name]: newValue };
        }
        return item;
      });
      // console.log('handleChange new data: ',newData)
      setData(newData);
  };

  //test out new handleusergroup for persisting blank space
  const handleUserGroupChange = (value, id) => {

    const userGroupArray = Array.isArray(value) ? value : [];
    const newData = data.map((item) => {
      if (item.id === id) {
        return { ...item, user_group: userGroupArray.join(',') };
      }
      return item;
    });
    // console.log(newData);
    setData(newData);
};

  const handleSave = async (id) => {
      const userToEdit = data.find((user) => user.id === id);
      console.log('This is user to edit: ',userToEdit);
      if (userToEdit) {
          try {
              const updateData = {
                id: userToEdit.id,
                userId: userToEdit.username, // Changed to userId
                email: userToEdit.email,
                user_group: userToEdit.user_group,
                user_status: userToEdit.user_status,
                password: userToEdit.password || null
              };
              console.log(updateData);
              const response = await axios.post('http://localhost:8000/users/editUser', updateData);
              if (response.data.success) {
                alert('User successfully updated');
                stopEdit();
                //setRefreshData((prev) => !prev); // Trigger refresh
              }
          } catch (error) {
              alert('Failed to update user');
              console.error('Error updating user:', error);
          }
      }
  };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell><b>Username</b></TableCell>
                        <TableCell align="right"><b>Password</b></TableCell>
                        <TableCell align="right"><b>Email</b></TableCell>
                        <TableCell align="right"><b>User Group</b></TableCell>
                        <TableCell align="right"><b>User Status</b></TableCell>
                        <TableCell align="right"><b>Edit</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>
                                <TextField
                                    value={editIdx === row.id ? row.username : row.username}
                                    disabled={editIdx !== row.id}
                                    onChange={(e) => handleChange(e, 'username', row.id)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    placeholder="••••••••"
                                    type="password"
                                    disabled={editIdx !== row.id}
                                    value={editIdx === row.id ? row.password : ''}
                                    onChange={(e) => handleChange(e, 'password', row.id)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    value={editIdx === row.id ? (row.email !== null ? row.email : '') : (row.email !== null ? row.email : '')}
                                    disabled={editIdx !== row.id}
                                    onChange={(e) => handleChange(e, 'email', row.id)}
                                />
                            </TableCell>
                            <TableCell>
                                <FormControl size="small" fullWidth>
                                    <Select
                                    multiple
                                    value={editIdx === row.id ? (row.user_group ? row.user_group.split(',') : []) : (row.user_group ? row.user_group.split(',') : [])}
                                    onChange={(e) => handleUserGroupChange(e.target.value, row.id)}
                                    input={<OutlinedInput />}
                                    renderValue={(selected) => (
                                        <Stack direction="row" spacing={1}>
                                        {selected.map((value) => (
                                            <Chip
                                            key={value}
                                            label={value}
                                            onDelete={editIdx === row.id ? (event) => {
                                                event.stopPropagation();
                                                const newValues = row.user_group.split(',').filter(group => group !== value);
                                                handleUserGroupChange(newValues, row.id);
                                            } : undefined}
                                            deleteIcon={editIdx === row.id ? <CancelIcon onMouseDown={(event) => event.stopPropagation()} /> : undefined}
                                            />
                                        ))}
                                        </Stack>
                                    )}
                                    disabled={editIdx !== row.id}
                                    >
                                    {groups.map((group) => (
                                        <MenuItem key={group} value={group}>{group}</MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <TableCell>
                                <FormControl fullWidth>
                                    <Select
                                        value={editIdx === row.id ? row.user_status : row.user_status}
                                        onChange={(e) => handleChange(e, 'user_status', row.id)}
                                        disabled={editIdx !== row.id}
                                    >
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="disabled">Disabled</MenuItem>
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <TableCell align="right">
                                {editIdx === row.id ? (
                                    <Button onClick={() => handleSave(row.id)} color="primary">Save</Button>
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

export default ExampleTable;