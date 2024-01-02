import React from "react"
import { Link } from "react-router-dom"

function Header () {
    const [loggedIn, setLoggedIn] = useState()
    
    return (
        <header className="header-bar bg-primary mb-2">
            <div className="container d-flex flex-column flex-md-row align-items-center p-3">
                <h4 className="my-0 mr-md-auto font-weight-normal">
                    <Link to="/" className="text-white">
                        Task Management System
                    </Link>
                </h4>
            </div>
            {loggedIn ? <HeaderLoggedIn setLoggedIn={setLoggedIn} /> : <p> </p> }
        </header>
    )
}

export default Header