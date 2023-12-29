import React, { useEffect } from "react";
import Page from "./Page";
import axios from "axios";

function Login () {
    async function handleSubmit(e) {
        e.preventDefault()
        try {
            await axios.post('http://localhost:5000/login', {userId: 'test2', password: 'abcd123!@'})
            alert('User logged in')
        } catch (error) {
            if (error.response){
                    console.log(error.response)
                }else if(error.request){
                    console.log(error.request)
                }else if(error.message){
                    console.log(error.message)
                }
        }
    }
    return (
            <Page title ="Login">
            <div className="row align-items-center">
                <div className="col-lg-4 pl-lg-5 pb-3 py-lg-5">
                    <form onSubmit={handleSubmit} >
                        <div className="form-group">
                            <label htmlFor="username-register" className="text-muted mb-1">
                                <small>Username</small>
                            </label>
                            <input id="username-register" name="username" className="form-control" type="text"
                                placeholder="Enter username" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password-register" className="text-muted mb-1">
                                <small>Password</small>
                            </label>
                            <input id="password-register" name="password" className="form-control" type="password"
                                placeholder="Enter password" />
                        </div>
                        <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
            </Page>
        )
    };

export default Login