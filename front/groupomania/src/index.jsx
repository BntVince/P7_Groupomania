import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './utils/style/index.css'

import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Profil from './pages/Profil/Profil'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
   <React.StrictMode>
      <BrowserRouter>
         <Routes>
            <Route path="*" element={<Login />} />
            <Route path="home" element={<Home />} />
            <Route path="profil/:profilId" element={<Profil />} />
         </Routes>
      </BrowserRouter>
   </React.StrictMode>
)
