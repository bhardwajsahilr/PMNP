import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  HeartIcon,
  SunIcon,
  HomeIcon,
  UsersIcon } from
'lucide-react';
import { motion } from 'framer-motion';
export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setUser({
      name: 'Juan Dela Cruz',
      email
    });
    navigate('/select-barangay');
  };
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Panel */}
      <motion.div
        initial={{
          opacity: 0,
          x: -40
        }}
        animate={{
          opacity: 1,
          x: 0
        }}
        transition={{
          duration: 0.6
        }}
        className="lg:w-1/2 w-full lg:min-h-screen p-8 lg:p-16 flex flex-col justify-center items-center relative overflow-hidden"
        style={{
          background:
          'linear-gradient(135deg, #349FD5 0%, #FFD200 50%, #F68E22 100%)'
        }}>
        
        {/* Decorative background circles */}
        <div className="absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%" viewBox="0 0 800 800" fill="none">
            <circle cx="200" cy="200" r="120" fill="white" />
            <circle cx="600" cy="600" r="80" fill="white" />
            <circle cx="650" cy="150" r="50" fill="white" />
            <circle cx="100" cy="650" r="60" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 text-center max-w-md">
          {/* PMNP Image */}
          <div className="mb-8 flex justify-center">
            <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-2xl overflow-hidden shadow-2xl shadow-black/20 ring-4 ring-white/20">
              <img
                src="/361384064_111252718703712_1159015803651274304_n.jpg"
                alt="Philippine Multisectoral Nutrition Project - Health is Life"
                className="w-full h-full object-cover" />
              
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight">
            Alagang Pinas
          </h1>
          <p className="text-white/90 text-lg font-medium mb-2">
            Philippine Multisectoral Nutrition Project
          </p>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
            A caring, simple, and location-aware platform supporting community
            nutrition programs across the Philippines.
          </p>

          <div className="mt-8 text-center">
            <p className="text-white/90 text-lg font-semibold tracking-wide">
              Harmonized Information System
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right Panel */}
      <motion.div
        initial={{
          opacity: 0,
          x: 40
        }}
        animate={{
          opacity: 1,
          x: 0
        }}
        transition={{
          duration: 0.6,
          delay: 0.2
        }}
        className="lg:w-1/2 w-full min-h-[60vh] lg:min-h-screen bg-white flex items-center justify-center p-8">
        
        <div className="w-full max-w-md">
          {/* Government Logos */}
          <div className="flex items-center justify-center gap-5 mb-6">
            <img
              src="/pasted-image.png"
              alt="Department of Health - Republic of the Philippines"
              className="w-16 h-16 object-contain" />
            
            <img
              src="/pasted-image-1.png"
              alt="Bagong Pilipinas"
              className="w-16 h-16 object-contain" />
            
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <SunIcon size={20} className="text-primary" />
              </div>
              <span className="text-xl font-bold text-gray-800">
                PMNP Portal
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome back
            </h2>
            <p className="text-gray-500 text-sm">
              Sign in to continue to your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error &&
            <motion.div
              initial={{
                opacity: 0,
                y: -10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="bg-alert-50 border border-alert-200 text-alert rounded-lg px-4 py-3 text-sm">
              
                {error}
              </motion.div>
            }

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <MailIcon
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all" />
                
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <LockIcon
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all" />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  
                  {showPassword ?
                  <EyeOffIcon size={18} /> :

                  <EyeIcon size={18} />
                  }
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-secondary hover:text-secondary-600 font-medium transition-colors">
                
                Forgot password?
              </button>
            </div>

            <motion.button
              whileHover={{
                scale: 1.01
              }}
              whileTap={{
                scale: 0.98
              }}
              type="submit"
              className="w-full py-3.5 bg-primary hover:bg-primary-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/25 text-sm">
              
              Sign In
            </motion.button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            © 2026 Philippine Multisectoral Nutrition Project
          </p>
        </div>
      </motion.div>
    </div>);

}