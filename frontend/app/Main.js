import React from 'react'
import ReactDOM from 'react-dom'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import Header from './components/Header'
import HomeGuest from './components/HomeGuest'
import Footer from './components/Footer'
import UserManagement from './components/userManagement'
import Terms from './components/Terms'


function Component () {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<HomeGuest />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/terms" element={<Terms />} />
            </Routes>
            <Footer />
        </BrowserRouter>
        
    )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Component/>)

if (module.hot) {
    module.hot.accept()
}