import React, { useEffect, useState } from "react";
import Multiselect from 'multiselect-react-dropdown';
import Select from 'react-select';

const data = [
    {username : 'test', password : 'test', email : 'test', userGroup : 'dev,pl,admin', userStatus : 'active'},
    {username : 'test2', password : 'test', email : 'test', userGroup : 'dev,pl,admin', userStatus : 'active'},
    {username : 'test3', password : 'test', email : 'test', userGroup : 'dev,pl,admin', userStatus : 'active'}

]

// const groupData = [
//     {groupName: 'dev'},
//     {groupName: 'pl'},
//     {groupName: 'admin'},
//     {groupName: 'pppp'},
// ]

function ExampleTable() {
    const [groupName, setGroupName] = useState(['dev', 'pl', 'admin']);
    const [userStatus, setUserStatus] = useState(['active', 'disabled']);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-auto">
                    <table className="table table-responsive">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Email</th>
                                <th>User Group</th>
                                <th>User Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        {data.map((val, key) => {
                            return (
                            <tr key={val.username}>
                                <td><input type="text" value={val.username} disabled={true}/></td>
                                <td><input type="text" value={val.password} disabled={true} /></td>
                                <td><input type="text" value={val.email} disabled={true} /></td>
                                <td><Select 
                                        isObject={false}
                                        options={groupName}
                                        disabled={true}/></td>
                                <td><Select 
                                        options={userStatus}
                                        disabled={true}/></td>
                                <td><button className="btn btn-primary"> Edit </button></td>
                            </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


export default ExampleTable