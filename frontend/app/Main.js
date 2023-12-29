import React from 'react'
import ReactDOM from 'react-dom'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import Header from './components/Header'
import Login from './components/Login'
import Footer from './components/Footer'
import UserManagement from './components/userManagement'
import Terms from './components/Terms'
import UserTable from './components/UserTable'
import ExampleTable from './components/ExampleTable'


function Component () {
    return (
        <BrowserRouter>
            <Header />
            
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/user-management" element={<ExampleTable />} />
                <Route path="/user-profile" element={<UserProfile />} />
            </Routes>
        </BrowserRouter>
        
    )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Component/>)

if (module.hot) {
    module.hot.accept()
}