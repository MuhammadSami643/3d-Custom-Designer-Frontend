import React, { useState } from 'react';
import { useCustomizerStore } from '../store/useCustomizerStore';
import { ShieldCheck, User, Mail, Lock, ArrowRight, Loader } from 'lucide-react';

export default function Auth() {
  const store = useCustomizerStore();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Data:", {
      username,
      email,
      password,
      mode: isLogin ? "login" : "register",
    });

    try {
      if (isLogin) {
        await store.login(email, password);
      } else {
        await store.register(username, email, password);
      }
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    store.setView(isLogin ? 'register' : 'login');
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 bg-[#090D16]">
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl space-y-6 shadow-2xl relative">

        {/* Glow Header */}
        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-brand-primary to-transparent" />

        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-brand-primary/10 rounded-full border border-brand-primary/20 text-brand-primary mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold uppercase tracking-wider text-white">
            {isLogin ? 'Welcome Back Coach' : 'Create Customizer Profile'}
          </h2>

          <p className="text-xs text-brand-text/50">
            {isLogin
              ? 'Sign in to access your saved cloud blueprints'
              : 'Register to upload logos and synchronize order histories'}
          </p>
        </div>

        {/* Error */}
        {store.authError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs font-semibold text-center uppercase tracking-wide">
            {store.authError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-brand-text/50">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-brand-text/30" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. coachsmith"
                  className="glass-input pl-10 text-xs w-full"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-brand-text/50">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-brand-text/30" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coach@team.com"
                className="glass-input pl-10 text-xs w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-brand-text/50">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-brand-text/30" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input pl-10 text-xs w-full"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={store.authLoading}
            className="w-full glass-btn-primary py-3 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 mt-6 shadow"
          >
            {store.authLoading && (
              <Loader className="w-3.5 h-3.5 animate-spin" />
            )}

            {store.authLoading
              ? 'SUBMITTING...'
              : isLogin
              ? 'SIGN IN'
              : 'REGISTER ACCOUNT'}

            {!store.authLoading && (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center pt-4 border-t border-brand-border/40 space-y-3">

          <button
            onClick={toggleMode}
            className="text-xs text-brand-primary hover:underline font-medium block mx-auto uppercase tracking-wider"
          >
            {isLogin
              ? "Need a profile? Register here"
              : "Have an account? Log in here"}
          </button>

          <button
            onClick={() => store.setView('customizer')}
            className="text-[10px] text-brand-text/40 hover:text-white uppercase tracking-widest font-bold block mx-auto hover:underline"
          >
            Continue as Guest (No Cloud Backup)
          </button>

        </div>
      </div>
    </div>
  );
}