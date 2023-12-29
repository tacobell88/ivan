import React, { useEffect, useState } from "react";
import axios from 'axios';

const dummyUsers = [
    {
        username: 'test', password: 'test', email : 'test@abc.com', user_group : "dev,pm", user_status: "active"
    },
    {
        username: 'test2', password: 'test2', email : 'test@abc.com', user_group : "admin", user_status: "active"
    },
]

function UserTable () {
    const groupOptions = [
        'dev', 'pl', 'admin', 'test'
    ]

    const statusOptions = [
        'active', 'disabled'
    ]
    const [users, setUsers] = useState([dummyUsers]);
    const [editUserID, setEditUserID] = useState(null);

    const handleEdit = (username) => {
        setEditUserID(username);
    }

    const handleSave = (username) => {
        setEditUserID(null);
    }

    const isEditing = (username) => {
        return username === editUserID;
    }

    const handleGroupChange = (e, username) => {
        const selectedGroups = Array.from(e.target.selectedOptions, option => option.value);
        const updatedUsers = users.map(user => {
            if (user.username === username) {
                return {...user, user_group: selectedGroups.join(',')};
            }
            return user;
        });
        setUsers(updatedUsers);
    }

    const renderSelectOptions = (options) => {
        return options.map(option => {
            <option key={option} value={option}> {option} </option>
        })
    }

    // const [users, setUsers] = useState([]);
    // const [editUserID, setEditUserID] = useState(null);

    // useEffect(()=> {
    //     axios.get('localhost:5000/users/getUsers').then(response => {
    //                                     setEditUserID(response.data);
    //     })
    //     .catch(err => console.error('Error fetching users:', err));
    // }, []);

    // const handleEdit = (id) => {
    //     setEditUserID(id);
    // }

    // const handleSave = (id) => {
    //     setEditUserID(null);
    // }

    // const isEditing = (id) => {
    //     return id === editUserID;
    // }
    // const userList = {
    //     userId : "John Doe",
    //     password : "Test",
    //     email : "abc@email.com",
    //     userGroup : "Test",
    //     userStatus : "Test"
    // }

    return (
        <>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Email</th>
                        <th>User Group</th>
                        <th>User Status</th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                {users.map(user => {
                    return (
                        <tr key={user.username}>
                            <td>{user.username}</td>
                            {/*<td>
                                {isEditing(user.username) ? <input type="text" defaultValue={user.username} /> : user.username}
                            </td>
                            <td>
                                {isEditing(user.username) ? <input type="password" defaultValue={user.password} /> : user.password}
                            </td>
                            <td>
                                {isEditing(user.username) ? <input type="text" defaultValue={user.password} /> : user.password}
                            </td> 
                            <td>
                                {isEditing(user.username) ? <input type="password" defaultValue={user.password} /> : user.password}
                    </td>*/}    
                        </tr>
                    )
                })}
                </tbody>   
            </table>
        </div>
        </>
    )
}

export default UserTable