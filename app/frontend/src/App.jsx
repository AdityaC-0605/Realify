import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import HomePage from './pages/Homepage'
import LiveNewsPage from './pages/LiveNewsPage'
import ManualCheckPage from './pages/ManualCheckPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/live-news" element={<LiveNewsPage />} />
            <Route path="/manual-check" element={<ManualCheckPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </Layout>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
