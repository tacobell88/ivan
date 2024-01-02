import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function CreateUser() {
    
    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const repsonse = await axios.post('http://localhost:8000/users/createUser', {
                userId : username,
                password: password,
                email: email,
                user_group: userGroup
            })
        } catch (error) {
            
        }
    }
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8 pb-3">
                    <form className="mb-0 pt-4 pt-md-0" onSubmit={handleSubmit}>
                        <div className="row align-items-center">
                            <div className="col-md-2 pr-md-1 mb-3 mb-md-0">
                                <input name="username" className="form-control form-control-sm input-dark" type="text"
                                    placeholder="Username" autoComplete="off" />
                            </div>
                            <div className="col-md-2 pr-md-1 mb-3 mb-md-0">
                                <input name="password" className="form-control form-control-sm input-dark" type="password"
                                    placeholder="Password" />
                            </div>
                            <div className="col-md-2 pr-md-1 mb-3 mb-md-0">
                                <input name="email" className="form-control form-control-sm input-dark" type="text"
                                    placeholder="Email" autoComplete="off" />
                            </div>
                            <div className="col-md-2 pr-md-1 mb-3 mb-md-0">
                                <input name="userGroup" className="form-control form-control-sm input-dark" type="text"
                                    placeholder="User Group" autoComplete="off" />
                            </div>
                            <div className="col-md-2 pl-md-1 ">
                                <button className="btn btn-success btn-sm w-100">Create User</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
    
    
}