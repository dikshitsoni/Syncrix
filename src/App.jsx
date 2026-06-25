import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SyncrixProvider, useSyncrix } from './context/SyncrixContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Deals from './pages/Deals';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { ShieldAlert, Sparkles, LogOut, Check } from 'lucide-react';

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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pl-[80px]">
        
        {/* Modular Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Content Panel Viewport */}
        <main className="flex-1 overflow-y-auto">
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
      <Route path="/profile" element={
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
