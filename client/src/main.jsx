// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Timeline from './pages/Timeline'
import NewEntry from './pages/NewEntry'
import JoinSpace from './pages/JoinSpace'

const router = createBrowserRouter([
  { path: '/', element: <Auth/> },
  { path: '/dashboard', element: <Dashboard/> },
  { path: '/timeline/:spaceId', element: <Timeline/> },
  { path: '/new/:spaceId', element: <NewEntry/> },
  { path: '/join', element: <JoinSpace/> },
])

const qc = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={qc}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)

