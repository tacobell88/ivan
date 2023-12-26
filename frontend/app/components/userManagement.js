import React, { useEffect } from "react";
import Page from "./Page.js";

function UserManagement () {
    return (
        <Page title="User Management">
            <h2>User Management</h2>
            <div>
                <form className="mb-0 pt-4 pt-md-0">
                    <div className="row align-items-center">
                        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                        <input name="username" className="form-control form-control-sm input-dark" type="text"
                            placeholder="Username" autoComplete="off" />
                        </div>
                        <div className="col-md-auto">
                                <button className="btn btn-success btn-sm">Create Group</button>
                        </div>
                    </div>  
                </form>
            </div>
            <div>
                <form className="mb-0 pt-4 pt-md-0">
                    <div className="row align-items-center">
                        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                            <input name="username" className="form-control form-control-sm input-dark" type="text"
                                placeholder="Username" autoComplete="off" />
                        </div>
                        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                            <input name="password" className="form-control form-control-sm input-dark" type="password"
                                placeholder="Password" />
                        </div>
                        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                            <input name="email" className="form-control form-control-sm input-dark" type="text"
                                placeholder="Email" autoComplete="off" />
                        </div>
                        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                            <input name="userGroup" className="form-control form-control-sm input-dark" type="text"
                                placeholder="User Group" autoComplete="off" />
                        </div>
                        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                            <input name="userStatus" className="form-control form-control-sm input-dark" type="text"
                                placeholder="Status" autoComplete="off" />
                        </div>
                        <div className="col-md-auto">
                            <button className="btn btn-success btn-sm">Create User</button>
                        </div>
                    </div>
                </form>
            </div>
        </Page>
    )
}

export default UserManagement