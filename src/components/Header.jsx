import React from 'react';
import { useCustomizerStore } from '../store/useCustomizerStore';
import { User, LogOut, LayoutDashboard, Shirt, Compass } from 'lucide-react';

export default function Header() {
  const store = useCustomizerStore();

  return (
    <header className="h-16 px-6 border-b border-brand-border/60 bg-brand-card/65 backdrop-blur-md flex items-center justify-between z-20">
      {/* Brand logo */}
      <button 
        onClick={() => store.setView('landing')}
        className="flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <span className="w-12 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-extrabold tracking-wider text-sm shadow shadow-brand-primary/25">
          Sami
        </span>
        <span className="font-extrabold tracking-widest text-sm uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#F3F4F6] to-gray-400">
          3d Design Builder
        </span>
      </button>

      {/* Navigation tabs */}
      <nav className="flex items-center gap-1">
        <button
          onClick={() => {
            store.setProduct('jersey');
            store.setView('customizer');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            store.activeView === 'customizer'
              ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30'
              : 'text-brand-text/60 hover:text-white hover:bg-brand-border/30 border border-transparent'
          }`}
        >
          <Shirt className="w-3.5 h-3.5" />
          Studio
        </button>

        <button
          onClick={() => store.setView('dashboard')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            store.activeView === 'dashboard'
              ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30'
              : 'text-brand-text/60 hover:text-white hover:bg-brand-border/30 border border-transparent'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Dashboard
        </button>
      </nav>

      {/* User authentication portal */}
      <div className="flex items-center gap-4">
        {store.user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-brand-text/80 bg-brand-border/40 border border-brand-border/60 px-3 py-1.5 rounded-lg font-semibold uppercase">
              <User className="w-3.5 h-3.5 text-brand-primary" />
              <span>{store.user.username}</span>
            </div>
            
            <button
              onClick={store.logout}
              className="p-2 border border-brand-border rounded-lg text-brand-text/60 hover:text-red-400 hover:bg-red-500/5 hover:border-red-900/30 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => store.setView('login')}
            className="glass-btn-primary py-2 px-5 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow"
          >
            <User className="w-3.5 h-3.5" />
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
