// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from './pages/Dashboard'
import Timeline from './pages/Timeline'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignUp'
import "./index.css";

const router = createBrowserRouter([
  { path: '/', element: <LandingPage/> },
  { path: '/register', element: <SignupPage/> },
  { path: '/login', element: <LoginPage/> },
  { path: '/dashboard', element: <Dashboard/> },
  { path: '/timeline/:spaceId', element: <Timeline/> },

])

const qc = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={qc}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)

