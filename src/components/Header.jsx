import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCustomizerStore } from '../store/useCustomizerStore';
import {
  User,
  LogOut,
  LayoutDashboard,
  Shirt,
  Menu,
  X
} from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useCustomizerStore();

  const currentPath = location.pathname;

  const [mobileMenu, setMobileMenu] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    store.logout();
    navigate('/');
    setMobileMenu(false);
  };

  const goTo = (path) => {
    navigate(path);
    setMobileMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full h-16 px-4 sm:px-6 border-b border-brand-border/60 bg-brand-card/80 backdrop-blur-md flex items-center justify-between z-50">

      {/* LOGO */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2"
      >
        <span className="w-10 sm:w-12 h-7 sm:h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-extrabold text-xs sm:text-sm shadow">
          Sami
        </span>

        {/* TITLE (FIXED: NOW VISIBLE ON MOBILE) */}
        <span className="block font-extrabold tracking-widest text-[10px] sm:text-sm uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#F3F4F6] to-gray-400">
          3D Design Builder
        </span>
      </button>

      {/* DESKTOP NAV */}
      <nav className="hidden md:flex items-center gap-1">

        <button
          onClick={() => {
            store.setProduct('jersey');
            navigate('/customizer');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
            currentPath === '/customizer'
              ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30'
              : 'text-brand-text/60 hover:text-white hover:bg-brand-border/30'
          }`}
        >
          <Shirt className="w-3.5 h-3.5" />
          Studio
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
            currentPath === '/dashboard'
              ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30'
              : 'text-brand-text/60 hover:text-white hover:bg-brand-border/30'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Dashboard
        </button>

      </nav>

      {/* AUTH (DESKTOP) */}
      <div className="hidden md:flex items-center gap-4">

        {store.user ? (
          <>
            <div className="flex items-center gap-1.5 text-xs text-brand-text/80 bg-brand-border/40 border border-brand-border/60 px-3 py-1.5 rounded-lg font-semibold uppercase">
              <User className="w-3.5 h-3.5 text-brand-primary" />
              {store.user.username}
            </div>

            <button
              onClick={handleLogout}
              className="p-2 border border-brand-border rounded-lg hover:text-red-400 hover:bg-red-500/5 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="glass-btn-primary py-2 px-5 text-xs font-bold uppercase"
          >
            Sign In
          </button>
        )}
      </div>

      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setMobileMenu(!mobileMenu)}
        className="md:hidden p-2 rounded-lg border border-brand-border text-white"
      >
        {mobileMenu ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* MOBILE DROPDOWN */}
      {mobileMenu && (
        <div
          ref={menuRef}
          className="absolute top-16 right-4 w-56 bg-[#0B0F1A] border border-brand-border rounded-xl shadow-xl p-2 flex flex-col gap-1 animate-fade-in"
        >

          <button
            onClick={() => goTo('/customizer')}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase rounded-lg hover:bg-brand-border/30"
          >
            <Shirt className="w-4 h-4" />
            Studio
          </button>

          <button
            onClick={() => goTo('/dashboard')}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase rounded-lg hover:bg-brand-border/30"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <div className="border-t border-brand-border my-1" />

          {store.user ? (
            <>
              <div className="px-3 py-2 text-xs text-brand-text/70 font-semibold uppercase">
                {store.user.username}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase text-red-400 hover:bg-red-500/10 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => goTo('/login')}
              className="glass-btn-primary py-2 px-3 text-xs font-bold uppercase"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </header>
  );
}