import React, { useState, useEffect, useContext } from 'react'
import ReactDOM from 'react-dom/client'
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie';
import { AuthContext, AuthProvider, useAuth } from './assets/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import AdminRoute from './routes/AdminRoute';

import { ToastContainer, toast } from 'react-toastify';

// import StateContext from './assets/StateContext';

//importing built components to use
import Header from './components/Header'
import Login from './components/Login'
import HeaderLoggedIn from './components/HeaderLoggedIn'
import UserManagement from './components/UserManagement'
import HomePage from './components/HomePage'
import ExampleTable from './components/ExampleTable'
import UserProfile from './components/UserProfile';
import { UserManagementProvider } from './assets/UserMgntContext';
import GlobalContext from "./assets/GlobalContext";



function Component () {
    const [isAdmin, setIsAdmin] = useState(false);
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    // const navigate = useNavigate();
    const handleAlerts = (msg, success) => {
        if (success) {
          toast.success(msg);
        } else {
          toast.error(msg);
        }
      };

    useEffect(() => {
        console.log('Executing useEffect to verify token');
        const tokenValue = Cookies.get('token');
        
        async function verifyToken () {
            if (tokenValue) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`;
                try {
                    const response = await axios.post('http://localhost:8000/verifyToken', {})
                    console.log('Verify Token response: ', response.data.message);
                    if (response.data.success) {
                        console.log('Token verification success: ', response.data.success)
                        setIsLoggedIn(true);
                    } else {
                        // implement a function to throw the the user out if token is invalid
                        Cookies.remove('token');
                        axios.defaults.headers.common["Authorization"] = "";
                        handleAlerts('Invalid Token', false);
                        setIsLoggedIn(false);
                        // navigate('/');
                    }
                } catch (error) {
                    console.log('Verify Token Error: ', error)
                    if (error.response.data.errMessage === "User is disabled") {
                        Cookies.remove('token');
                        axios.defaults.headers.common["Authorization"] = "";
                        handleAlerts('User is disabled', false);
                    }
                    
                    setIsLoggedIn(false);
                    window.location.href = '/';
                }
            } 
            
        }
        verifyToken();
    }, []);

    return (
        <GlobalContext.Provider value={{handleAlerts}}>
            <BrowserRouter>
                {isLoggedIn ? <Header /> : <div> </div> }
                <Routes>
                <Route path="/" element=<PublicRoute>{<Login />}</PublicRoute> />
                <Route path="/home" element={isLoggedIn && <ProtectedRoute> <HomePage /> </ProtectedRoute>} />
                {/* TO WORK ON DOING A 404 PAGE */}
                <Route path="/user-management" element={ isLoggedIn && <UserManagement />} />
                {/* <Route path = '/user-management' element={<UserManagement /> } /> */}
                <Route path="/user-profile" element={ isLoggedIn && <ProtectedRoute> <UserProfile/> </ProtectedRoute>} />
                </Routes>
            </BrowserRouter>
        </GlobalContext.Provider>
        
    )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render( 
        <AuthProvider>
                <UserManagementProvider>
                    <Component />
                </UserManagementProvider>
                <ToastContainer autoClose={1000} />
        </AuthProvider>   
)
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