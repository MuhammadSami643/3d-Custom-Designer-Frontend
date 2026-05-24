import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCustomizerStore } from '../store/useCustomizerStore';

import {
  User,
  LogOut,
  LayoutDashboard,
  Shirt
} from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const store = useCustomizerStore();

  const currentPath = location.pathname;

  const handleLogout = () => {
    store.logout();
    navigate('/');
  };

  return (
    <header className="h-16 px-6 border-b border-brand-border/60 bg-brand-card/65 backdrop-blur-md flex items-center justify-between z-20">

      {/* LOGO */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <span className="w-12 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-extrabold tracking-wider text-sm shadow shadow-brand-primary/25">
          Sami
        </span>

        <span className="font-extrabold tracking-widest text-sm uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#F3F4F6] to-gray-400">
          3D Design Builder
        </span>
      </button>

      {/* NAVIGATION */}
      <nav className="flex items-center gap-1">

        {/* CUSTOMIZER */}
        <button
          onClick={() => {
            store.setProduct('jersey');
            navigate('/customizer');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            currentPath === '/customizer'
              ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30'
              : 'text-brand-text/60 hover:text-white hover:bg-brand-border/30 border border-transparent'
          }`}
        >
          <Shirt className="w-3.5 h-3.5" />
          Studio
        </button>

        {/* DASHBOARD */}
        <button
          onClick={() => navigate('/dashboard')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            currentPath === '/dashboard'
              ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30'
              : 'text-brand-text/60 hover:text-white hover:bg-brand-border/30 border border-transparent'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Dashboard
        </button>

      </nav>

      {/* AUTH */}
      <div className="flex items-center gap-4">

        {store.user ? (
          <div className="flex items-center gap-3">

            <div className="flex items-center gap-1.5 text-xs text-brand-text/80 bg-brand-border/40 border border-brand-border/60 px-3 py-1.5 rounded-lg font-semibold uppercase">
              <User className="w-3.5 h-3.5 text-brand-primary" />
              <span>{store.user.username}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 border border-brand-border rounded-lg text-brand-text/60 hover:text-red-400 hover:bg-red-500/5 hover:border-red-900/30 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="glass-btn-primary py-2 px-5 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow"
          >
            <User className="w-3.5 h-3.5" />
            Sign In
          </button>
        )}

      </div>

    </header>
  );
};