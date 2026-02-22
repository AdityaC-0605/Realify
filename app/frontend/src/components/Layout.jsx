import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Radio, 
  FileText, 
  BarChart3, 
  Shield,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

const Layout = ({ children }) => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Live News', href: '/live-news', icon: Radio },
    { name: 'Manual Check', href: '/manual-check', icon: FileText },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-slate-200/70 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-sky-600 to-cyan-500 rounded-xl shadow-sm">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Realify</h1>
                <p className="text-xs text-slate-500 -mt-1">Verify Before You Believe</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-sky-100 text-sky-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-sky-100 text-sky-800'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-sky-600 to-cyan-500 rounded-lg">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Realify</h3>
                <p className="text-xs text-slate-500">Verify Before You Believe</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-slate-600">
                Powered by Machine Learning & AI
              </p>
              <p className="text-xs text-slate-500 mt-1">
                © 2024 Realify. Built for truth verification.
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-sky-700">4</p>
                <p className="text-xs text-slate-500">ML Models</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-sky-700">91%</p>
                <p className="text-xs text-slate-500">Accuracy</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-sky-700">Real-time</p>
                <p className="text-xs text-slate-500">Analysis</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-sky-700">Live</p>
                <p className="text-xs text-slate-500">News Feed</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
