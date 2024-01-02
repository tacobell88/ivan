import React from "react";
import { Link } from 'react-router-dom'

function HeaderLoggedIn () {
    return (
        <div className="flex-row my-3 my-md-0">
            <Link to="/user-management" className="text-white"> User Management </Link>
            <Link to="/user-profile" className="text-white"> My Profile </Link>
            <Link to="/logout" className="text-white"> Logout </Link>
        </div>
    )
}

export default HeaderLoggedIn