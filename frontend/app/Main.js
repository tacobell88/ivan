import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie';

//importing built components to use
import Header from './components/Header'
import Login from './components/Login'
import HeaderLoggedIn from './components/HeaderLoggedIn'
import UserManagement from './components/UserManagement'
import HomePage from './components/HomePage'
import UserTable from './components/UserTable'
import ExampleTable from './components/ExampleTable'
import UserProfile from './components/UserProfile';


function Component () {
  const [isLoggedIn, setIsLoggedIn] = useState([]);

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/user-profile" element={<UserProfile/>} />
                {/* <Route path="/user-profile" element={<UserProfile />} /> */}
                
            </Routes>
        </BrowserRouter>
        
    )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Component/>)

if (module.hot) {
    module.hot.accept()
}

// import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Cookies from "js-cookie";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";


// import Header from './components/Header'
// import Login from './components/Login'
// import Footer from './components/Footer'
// import UserManagement from './components/UserManagement'
// import Terms from './components/Terms'
// import UserTable from './components/UserTable'
// // import ExampleTable from './components/ExampleTable'
// // // Import your components
// // import Header from "./Header";
// // import Login from "./Login";
// // import UserProfile from "./UserProfile";
// // import UserManagement from "./UserManagement";
// // import HomePage from "./HomePage"; // Placeholder for your home page component

// axios.defaults.baseURL = "http://localhost:8000"; // Adjust according to your backend

// function Main() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userRole, setUserRole] = useState(""); // 'admin' or 'ordinary'

//   // Fetch token from cookies on initial render
//   useEffect(() => {
//     const token = Cookies.get("token");
//     if (token) {
//       verifyToken(token);
//     }
//   }, []);

//   // Function to verify token
//   const verifyToken = async (token) => {
//     try {
//       const response = await axios.get("/api/verifyToken", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       // Set user login and role based on response
//       if (response.data.success) {
//         setIsLoggedIn(true);
//         setUserRole(response.data.role); // Assuming the role is returned from API
//       } else {
//         toast.error("Session expired. Please login again.");
//         setIsLoggedIn(false);
//       }
//     } catch (error) {
//       console.error("Token verification error:", error);
//       setIsLoggedIn(false);
//     }
//   };

//   return (
//     <BrowserRouter>
//       {isLoggedIn && <Header userRole={userRole} />}
//       <Routes>
//         <Route path="/" element={!isLoggedIn ? <Login setLogin={setIsLoggedIn} setRole={setUserRole} /> : <HomePage />} />
//         {userRole === "admin" && <Route path="/usermanagement" element={<UserManagement />} />}
//         <Route path="/myprofile" element={<UserProfile />} />
//         {/* Define other routes as needed */}
//       </Routes>
//       <ToastContainer position="top-center" />
//     </BrowserRouter>
//   );
// }

// const root = ReactDOM.createRoot(document.querySelector("#app"));
// root.render(<Main />);

// export default Main;