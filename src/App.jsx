import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SyncrixProvider, useSyncrix } from './context/SyncrixContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Deals from './pages/Deals';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { Menu, ShieldAlert, Sparkles, LogOut, Check } from 'lucide-react';

function ProtectedLayout({ children }) {
  const { currentUser } = useSyncrix();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-accent-light">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Primary Workspace Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header navbar with Mobile Menu trigger */}
        <header className="sticky top-0 bg-accent-light/85 backdrop-blur-md border-b border-[#2E6F40]/12 h-16 flex items-center justify-between px-4 sm:px-6 z-20 shadow-xs">
          
          <div className="flex items-center gap-3">
            {/* Hamburger trigger for mobile */}
            <button
              id="sidebar-mobile-toggle"
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-gray-50 active:scale-95 transition-all lg:hidden"
              title="Open Navigation Menu"
            >
              <Menu size={20} />
            </button>
            
            {/* Visual SaaS workspace indicator */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#253D2C] bg-primary-light px-2 py-0.5 rounded-md">
                Workspace: {currentUser.company}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-gray-400 font-sans hidden md:inline">
              Sync State: <strong className="text-[#2E6F40]">● SECURE LOCAL</strong>
            </span>
            <div className="h-8 w-[1px] bg-gray-100 hidden sm:block"></div>
            
            {/* Minimal User indicator */}
            <div className="flex items-center gap-2">
              <div 
                className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-inner"
                style={{ backgroundColor: currentUser.avatarColor || '#2E6F40' }}
              >
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-accent-dark leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-gray-400 font-bold leading-none uppercase">{currentUser.email}</p>
              </div>
            </div>
          </div>

        </header>

        {/* Content Panel Viewport */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

function SyncrixAppRoutes() {
  return (
    <Routes>
      {/* Auth Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Freelancer workspace routes */}
      <Route path="/" element={
        <ProtectedLayout>
          <Dashboard />
        </ProtectedLayout>
      } />
      <Route path="/contacts" element={
        <ProtectedLayout>
          <Contacts />
        </ProtectedLayout>
      } />
      <Route path="/deals" element={
        <ProtectedLayout>
          <Deals />
        </ProtectedLayout>
      } />
      <Route path="/analytics" element={
        <ProtectedLayout>
          <Analytics />
        </ProtectedLayout>
      } />
      <Route path="/settings" element={
        <ProtectedLayout>
          <Settings />
        </ProtectedLayout>
      } />

      {/* Default Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <SyncrixProvider>
      <HashRouter>
        <SyncrixAppRoutes />
      </HashRouter>
    </SyncrixProvider>
  );
}
