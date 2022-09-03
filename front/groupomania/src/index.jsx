import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './utils/style/index.css'

import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Profile from './pages/Profile/Profile'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
   <React.StrictMode>
      <BrowserRouter>
         <Routes>
            <Route path="*" element={<Login />} />
            <Route path="home" element={<Home />} />
            <Route path="profile/:userId" element={<Profile />} />
         </Routes>
      </BrowserRouter>
   </React.StrictMode>
)
