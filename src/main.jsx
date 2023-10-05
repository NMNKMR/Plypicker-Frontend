import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css';
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements, redirect } from 'react-router-dom'
import App from './App'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import SignIn from './components/SignIn.jsx'
import Register from './components/Register.jsx'
import MarkAttendance from './components/MarkAttendance';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
        <Route path='' 
          loader={()=> {
            const token = localStorage.getItem('jwtToken');
            if(!token) return redirect('/signin')
            else return null
          }}
          element = {<Dashboard jwtToken={localStorage.getItem('jwtToken')}/>}
        />
        <Route path='signin' element={<SignIn />} />
        <Route path='register' element={<Register />}/>
        <Route path='attendance' element={<MarkAttendance />}/>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
