import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useSyncrix } from '../context/SyncrixContext';

export default function Header({ onMenuClick }) {
  const { currentUser, isDemo } = useSyncrix();

  if (!currentUser && !isDemo) return null;

  return (
    <header className="sticky top-0 bg-white/30 backdrop-blur-md border-b border-white/10 h-15 flex items-center z-20 shadow-xs w-full">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Hamburger trigger for mobile */}
          <button
            id="sidebar-mobile-toggle"
            onClick={onMenuClick}
            className="p-1.5 rounded-lg text-accent-dark hover:text-primary hover:bg-white/40 active:scale-95 transition-all lg:hidden"
            title="Open Navigation Menu"
          >
            <Menu size={20} />
          </button>
          
          {/* Visual SaaS workspace indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#253D2C] bg-primary-light px-2 py-0.5 rounded-md">
              Workspace: {currentUser ? currentUser.company : 'Demo Mode'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isDemo && (
            <div className="flex items-center gap-4 mr-2">
              <Link 
                to="/login" 
                id="header-login-link"
                className="text-sm font-semibold text-accent-dark hover:text-primary transition-all duration-200"
              >
                Log In
              </Link>
              <Link 
                to="/signup" 
                id="header-signup-btn"
                className="text-xs font-bold text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-xl shadow-md shadow-primary/10 hover:shadow-lg active:scale-95 transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}

          {currentUser && (
            <Link 
              to="/profile" 
              id="header-profile-link"
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-white/40 active:scale-98 transition-all duration-200 group border border-transparent hover:border-white/20 hover:shadow-xs"
              title="View Profile Settings"
            >
              <div 
                className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-inner group-hover:scale-105 transition-transform duration-200"
                style={{ backgroundColor: currentUser.avatarColor || '#2E6F40' }}
              >
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-accent-dark leading-tight group-hover:text-primary transition-colors duration-200">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-accent-dark/70 font-semibold leading-none uppercase tracking-wide">
                  {currentUser.email}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
