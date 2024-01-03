import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
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
import { UserManagementContext } from "../assets/UserMgntContext";

function ExampleTable() {
    const [data, setData] = useState([]);
    const [editIdx, setEditIdx] = useState(null);
    const [groups, setGroups] = useState([]);
    const { refreshData } = useContext(UserManagementContext);
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await axios.get('http://localhost:8000/users/getUsers');
          setData(response.data.message.map(user => ({
            ...user,
            user_group: user.user_group || '',
            editPassword: '' // Initialize editPassword for each user
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
    }, []);
  
    const startEdit = (id) => {
      setEditIdx(id);
    };
  
    const stopEdit = () => {
      setEditIdx(null);
    };
  
    const handleChange = (e, name, id) => {
      const newData = data.map((item) => {
        if (item.username === id) {
          return { ...item, [name]: e.target.value };
        }
        return item;
      });
      setData(newData);
    };
  
    const handleUserGroupChange = (value, id) => {
      const newData = data.map((item) => {
        if (item.username === id) {
          return { ...item, user_group: value.join(',') };
        }
        return item;
      });
      setData(newData);
    };
  
    const handleSave = async (id) => {
      const userToEdit = data.find((user) => user.username === id);
      if (userToEdit) {
        try {
          // Prepare data for API request
          const updateData = {
            ...userToEdit,
            password: userToEdit.editPassword || null, // Send null if no new password
          };
          delete updateData.editPassword; // Remove the temporary property
  
          await axios.post('http://localhost:8000/users/editUser', updateData);
          alert('User successfully updated');
          stopEdit();
          refreshData(); // Refresh the table data
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
              <TableRow key={row.username}>
                <TableCell>
                  <TextField
                    value={row.username}
                    disabled={true}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    placeholder="••••••••"
                    type="password"
                    disabled={editIdx !== row.username}
                    value={editIdx === row.username ? row.editPassword : ''}
                    onChange={(e) => handleChange(e, 'editPassword', row.username)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={editIdx === row.username ? row.email : row.email || ''}
                    disabled={editIdx !== row.username}
                    onChange={(e) => handleChange(e, 'email', row.username)}
                  />
                </TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <Select
                      multiple
                      value={editIdx === row.username ? row.user_group.split(',') : row.user_group.split(',')}
                      onChange={(e) => handleUserGroupChange(e.target.value, row.username)}
                      input={<OutlinedInput />}
                      renderValue={(selected) => (
                        <Stack direction="row" spacing={1}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              onDelete={(event) => {
                                event.stopPropagation();
                                const newValues = row.user_group.split(',').filter(group => group !== value);
                                handleUserGroupChange(newValues, row.username);
                              }}
                              deleteIcon={<CancelIcon onMouseDown={(event) => event.stopPropagation()} />}
                            />
                          ))}
                        </Stack>
                      )}
                      disabled={editIdx !== row.username}
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
                      value={editIdx === row.username ? row.user_status : row.user_status}
                      onChange={(e) => handleChange(e, 'user_status', row.username)}
                      disabled={editIdx !== row.username}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="disabled">Disabled</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="right">
                  {editIdx === row.username ? (
                    <Button onClick={() => handleSave(row.username)} color="primary">Save</Button>
                  ) : (
                    <Button onClick={() => startEdit(row.username)} color="primary">Edit</Button>
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
