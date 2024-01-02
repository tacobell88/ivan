import axios from "axios";
import React, { useState } from "react";

export default function CreateGroup () {
    const [groupName, setGroupName] = useState([])

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:8000/users/createRole',{
                user_group: groupName
            })
            alert('User added into database')
        } catch (error) {
            alert('Invalid group')
            if (error.response){
                    console.log(error.response.data)
                } else if(error.request){
                    console.log(error.request)
                } else if(error.message){
                    console.log(error.message)
                }
        }
    }
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8 pb-3 pt-5">
                    <form className="mb-0 pt-4 pt-md-0" onSubmit={handleSubmit}>
                        <div className="row align-items-center">
                            <div className="col-md-3 pr-md-1 mb-3 mb-md-0">
                                <input name="groupName" className="form-control form-control-sm input-dark" type="text"
                                    placeholder="Enter a group" autoComplete="off" onChange={e => setGroupName(e.target.value)} />
                            </div>
                            <div className="col-md-2 pl-md-1">
                                <button className="btn btn-success btn-sm w-100"> Create Group </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
    
    
}