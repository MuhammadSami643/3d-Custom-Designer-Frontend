import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomizerStore } from '../store/useCustomizerStore';
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader
} from 'lucide-react';

/* ================= INPUT FIELD ================= */
function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  Icon,
  error
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] uppercase font-bold tracking-wider text-brand-text/50">
        {label}
      </label>

      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          <Icon className="w-4 h-4 text-brand-text/30" />
        </div>

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full h-11 pl-10 pr-3 text-xs text-white
            placeholder:text-brand-text/40
            bg-brand-dark/40 border rounded-lg outline-none
            focus:ring-1 transition
            ${
              error
                ? 'border-red-500/60 focus:ring-red-500/30'
                : 'border-brand-border/50 focus:border-brand-primary/60 focus:ring-brand-primary/30'
            }
          `}
        />
      </div>

      {error && (
        <span className="text-[10px] text-red-400 font-medium">
          {error}
        </span>
      )}
    </div>
  );
}

/* ================= MAIN AUTH ================= */
export default function Auth() {
  const store = useCustomizerStore();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!isLogin) {
      if (!username || username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      } else if (!/^[A-Za-z]+$/.test(username)) {
        newErrors.username = 'Only letters A-Z allowed (no numbers or symbols)';
      }
    }

    if (!email) {
      newErrors.email = 'Email is required';
    }

    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (isLogin) {
        await store.login(email, password);
      } else {
        await store.register(username, email, password);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 bg-[#090D16]">
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl space-y-6 shadow-2xl">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-brand-primary/10 rounded-full border border-brand-primary/20 text-brand-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold uppercase tracking-wider text-white">
            {isLogin ? 'Welcome Back Coach' : 'Create Customizer Profile'}
          </h2>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <InputField
              label="Username"
              type="text"
              value={username}
              error={errors.username}
              onChange={(e) => {
                // ONLY letters allowed live
                const cleaned = e.target.value.replace(/[^A-Za-z]/g, '');
                setUsername(cleaned);
              }}
              placeholder="e.g. coachsmith"
              Icon={User}
            />
          )}

          <InputField
            label="Email"
            type="email"
            value={email}
            error={errors.email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="coach@team.com"
            Icon={Mail}
          />

          <InputField
            label="Password"
            type="password"
            value={password}
            error={errors.password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            Icon={Lock}
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={store.authLoading}
            className="w-full glass-btn-primary py-3 text-xs font-bold uppercase flex items-center justify-center gap-2"
          >
            {store.authLoading && (
              <Loader className="w-3.5 h-3.5 animate-spin" />
            )}

            {store.authLoading
              ? 'SUBMITTING...'
              : isLogin
              ? 'SIGN IN'
              : 'REGISTER'}

            {!store.authLoading && (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </form>

        {/* TOGGLE */}
        <div className="text-center pt-4 border-t border-brand-border/40 space-y-3">
          <button
            type="button"
            onClick={() => setIsLogin((p) => !p)}
            className="text-xs text-brand-primary uppercase"
          >
            {isLogin
              ? 'Need account? Register'
              : 'Already have account? Login'}
          </button>
<br />
          <button
            type="button"
            onClick={() => navigate('/customizer')}
            className="text-[10px] text-brand-text/40 uppercase"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}