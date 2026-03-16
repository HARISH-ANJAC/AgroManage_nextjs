'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-body bg-background selection:bg-primary/20">

      {/* Background Decoration (Matching Theme Colors) */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary rounded-full blur-[120px] opacity-50"></div>
      </div>

      {/* Atmospheric Hero Image */}
      <div
        className="absolute inset-0 z-0 opacity-[0.07] blur-[2px] pointer-events-none transition-opacity duration-1000"
        style={{ backgroundImage: "url('/login-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        {/* Branding Section */}
        <div className="flex flex-col items-center mb-10 group cursor-default">
          <div className="bg-primary p-3 rounded-xl mb-4 shadow-xl shadow-primary/20 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
            <Sprout className="text-primary-foreground w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">AgroManage</h1>
          <p className="text-muted-foreground mt-2 text-center text-sm font-medium">
            Forest Admin v2.0 • Enterprise Management
          </p>
        </div>

        {/* Login Card (Using Theme Card Component) */}
        <div className="bg-card/80 backdrop-blur-2xl border border-border rounded-2xl shadow-2xl p-8 md:p-10 transition-all duration-300 hover:shadow-primary/5">
          <div className="mb-8">

            <h2 className="text-2xl font-display font-bold text-foreground">Welcome Back</h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Please enter your details to sign in</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80 ml-1" htmlFor="email">
                Username or Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <User size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@agro-manage.com"
                  className="block w-full pl-11 pr-4 py-4 bg-muted/30 border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground/60 text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-sm font-bold text-foreground/80" htmlFor="password">
                  Password
                </label>
                <a className="text-xs font-bold text-secondary hover:text-secondary/80 focus:text-accent transition-colors" href="#">
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-4 bg-muted/30 border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground/60 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center ml-1 select-none">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 transition-all cursor-pointer accent-primary"
                />
              </div>
              <label htmlFor="remember" className="ml-2 block text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                Stay logged in for 30 days
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-70 text-primary-foreground font-bold py-4 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-2"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>


        {/* Rights Information */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
            © 2026 Vision Infotech Ltd. All rights reserved.
          </p>
        </div>
      </div>

      {/* Branded Footer Asset */}
      <div className="fixed bottom-0 left-0 w-full h-1/4 z-[-1] opacity-5 overflow-hidden pointer-events-none grayscale mix-blend-multiply transition-opacity duration-700">
        <img
          src="/agro-muted-footer.png"
          alt=""
          className="w-full h-full object-cover object-bottom"
        />
      </div>
    </div>
  );
}
