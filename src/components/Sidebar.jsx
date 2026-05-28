import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useSyncrix } from '../context/SyncrixContext';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { currentUser, logout } = useSyncrix();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Contacts', path: '/contacts', icon: Users },
    { name: 'Deals Pipeline', path: '/deals', icon: Briefcase },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuClass = (isActive) => {
    return `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
      isActive 
        ? 'bg-white/15 text-white shadow-xs font-semibold' 
        : 'text-white/70 hover:bg-white/10 hover:text-white'
    }`;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#253D2C]/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Root */}
      <aside 
        id="sidebar"
        className={`fixed inset-y-0 left-0 bg-primary z-40 flex flex-col justify-between border-r border-white/10 transition-all duration-300 transform 
          lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${isCollapsed ? 'lg:w-[80px]' : 'lg:w-[260px]'} w-[260px]`}
      >
        {/* Top Header section */}
        <div>
          <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex items-center justify-center p-2 rounded-lg bg-primary-light text-primary font-bold h-9 w-9 shrink-0">
                S
              </div>
              {!isCollapsed && (
                <span className="font-display text-xl font-bold tracking-tight text-white transition-opacity duration-200">
                  Syncrix<span className="text-secondary">.</span>
                </span>
              )}
            </div>
            
            {/* Collapse Trigger on desktop, Close button on Mobile */}
            <div className="flex items-center gap-1">
              <button 
                id="toggle-collapse"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex items-center justify-center h-8 w-8 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-all"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
              <button 
                id="close-sidebar-mobile"
                onClick={() => setIsOpen(false)}
                className="lg:hidden flex items-center justify-center h-8 w-8 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* User profile capsule */}
          {currentUser && (
            <div className={`p-4 border-b border-white/10 flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center py-5' : 'py-4'}`}>
              <div 
                className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-inner"
                style={{ backgroundColor: currentUser.avatarColor || '#68BA7F' }}
              >
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-white truncate">{currentUser.name}</h4>
                  <p className="text-[10px] text-white/60 font-medium truncate">{currentUser.company || 'Freelancer'}</p>
                </div>
              )}
            </div>
          )}

          {/* Menu Items */}
          <nav className="p-3 space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                id={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => menuClass(isActive)}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="shrink-0 group-hover:scale-105 transition-transform duration-200" size={18} />
                {!isCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom logout section */}
        <div className="p-3 border-t border-white/10">
          <button
            id="nav-logout"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:bg-red-500/15 hover:text-white transition-all duration-200 group"
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <LogOut className="shrink-0 group-hover:translate-x-[2px] transition-transform duration-200" size={18} />
            {!isCollapsed && (
              <span>Sign Out</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
