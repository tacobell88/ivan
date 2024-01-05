import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, Select, MenuItem, OutlinedInput, Chip, Stack } from '@mui/material/';
import CancelIcon from "@mui/icons-material/Cancel";
import { UserManagementContext } from "../assets/UserMgntContext";

function ExampleTable() {
  const [data, setData] = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [groups, setGroups] = useState([]);
  const { refreshData, setRefreshData } = useContext(UserManagementContext);

  useEffect(() => {
      const fetchUserData = async () => {
          try {
              const response = await axios.get('http://localhost:8000/users/getUsers');
              setData(response.data.message.map(user => ({
                  ...user,
                  user_group: user.user_group || '',
                  password: '' // Initialize password for each user
              })));
          } catch (error) {
              console.error('Error fetching user data:', error);
          }
      };
      fetchUserData();
  }, [refreshData]);

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
  }, [refreshData]);

  const startEdit = (id) => {
      setEditIdx(id);
  };

  const stopEdit = () => {
      setEditIdx(null);
  };

  const handleChange = (e, name, id) => {
      const newData = data.map((item) => {
          if (item.id === id) {
              return { ...item, [name]: e.target.value };
          }
          return item;
      });
      setData(newData);
  };

  const handleUserGroupChange = (value, id) => {
      const newData = data.map((item) => {
          if (item.id === id) {
              return { ...item, user_group: value.join(',') };
              
          }
          console.log(item);
          return item;
      });
      setData(newData);
  };

  const handleSave = async (id) => {
      const userToEdit = data.find((user) => user.id === id);
      console.log(userToEdit);
      if (userToEdit) {
          try {
              const updateData = {
                  userId: userToEdit.username, // Changed to userId
                  email: userToEdit.email,
                  user_group: userToEdit.user_group,
                  user_status: userToEdit.user_status,
                  password: userToEdit.password || null
              };
              console.log(updateData);
              await axios.post('http://localhost:8000/users/editUser', updateData);
              alert('User successfully updated');
              stopEdit();
              setRefreshData(!refreshData); // Trigger refresh
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
                                    value={editIdx === row.id ? row.email : row.email || ''}
                                    disabled={editIdx !== row.id}
                                    onChange={(e) => handleChange(e, 'email', row.id)}
                                />
                            </TableCell>
                            <TableCell>
                                <FormControl size="small" fullWidth>
                                    <Select
                                        multiple
                                        value={editIdx === row.id ? row.user_group.split(',') : row.user_group.split(',')}
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
                                            <MenuItem key={group} value={group}>
                                                {group}
                                            </MenuItem>
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