'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { encryptData, decryptData } from '@/lib/cryptoUtils';
import { API_URL } from '@/lib/config';

type LoginFormData = {
  LOGIN_NAME: string;
  PASSWORD_USER_HDR: string;
};

type LoginApiUser = {
  id?: number | string;
  loginName?: string;
  mailId?: string;
  role?: string;
  stockShowStatus?: string;
  outsideAccessYn?: string;
  [key: string]: unknown;
};

type LoginApiResponse = {
  msg?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: LoginApiUser;
};

const REMEMBERED_LOGIN_KEY = 'rememberedLogin';
const LOGIN_REQUEST_TIMEOUT_MS = 30000;

const showToast = async (type: 'success' | 'error', message: string) => {
  const { toast } = await import('sonner');
  if (type === 'success') {
    toast.success(message);
    return;
  }

  toast.error(message);
};

const parseJsonResponse = async (response: Response): Promise<LoginApiResponse> => {
  const raw = await response.text();
  if (!raw) return {};

  try {
    return JSON.parse(raw) as LoginApiResponse;
  } catch {
    return { msg: 'Unexpected response from server.' };
  }
};

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    LOGIN_NAME: '',
    PASSWORD_USER_HDR: ''
  });
  const [rememberMe, setRememberMe] = useState(false);

  const canSubmit =
    formData.LOGIN_NAME.trim().length > 0 &&
    formData.PASSWORD_USER_HDR.length > 0 &&
    !isLoading;

  // Load remembered credentials on mount
  useEffect(() => {
    const savedEncrypted = localStorage.getItem(REMEMBERED_LOGIN_KEY);
    if (!savedEncrypted) return;

    try {
      const savedData = decryptData(savedEncrypted) as Partial<LoginFormData> | null;
      if (typeof savedData?.LOGIN_NAME === 'string' && typeof savedData?.PASSWORD_USER_HDR === 'string') {
        setFormData({
          LOGIN_NAME: savedData.LOGIN_NAME,
          PASSWORD_USER_HDR: savedData.PASSWORD_USER_HDR
        });
        setRememberMe(true);
      }
    } catch (err) {
      console.error('Failed to load remembered login:', err);
      localStorage.removeItem(REMEMBERED_LOGIN_KEY);
    }
  }, []);

  // Clear credentials if Remember Me is unchecked
  useEffect(() => {
    if (!rememberMe) {
      localStorage.removeItem(REMEMBERED_LOGIN_KEY);
    }
  }, [rememberMe]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const LOGIN_NAME = formData.LOGIN_NAME.trim();
    const PASSWORD_USER_HDR = formData.PASSWORD_USER_HDR;

    if (!LOGIN_NAME || !PASSWORD_USER_HDR) {
      await showToast('error', 'Please enter username and password.');
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort('Login request timeout'), LOGIN_REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          LOGIN_NAME,
          PASSWORD_USER_HDR
        }),
        signal: controller.signal
      });

      const data = await parseJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.msg || 'Login failed. Please check your credentials.');
      }

      if (!data.accessToken || !data.refreshToken) {
        throw new Error('Login response is missing authentication tokens.');
      }

      const serverUser = data.user ?? {};
      const normalizedLoginName = String(serverUser.loginName ?? LOGIN_NAME);
      const normalizedUser = {
        ...serverUser,
        id: serverUser.id ?? null,
        loginName: normalizedLoginName,
        LOGIN_NAME: normalizedLoginName,
        mailId: String(serverUser.mailId ?? ''),
        role: String(serverUser.role ?? 'User'),
        stockShowStatus: String(serverUser.stockShowStatus ?? 'N'),
        outsideAccessYn: String(serverUser.outsideAccessYn ?? 'N')
      };

      // Store tokens and user info
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(normalizedUser));

      // Dispatch custom event to update sidebar data without refresh
      window.dispatchEvent(new Event('user-data-updated'));

      // Save credentials only if Remember Me is checked
      if (rememberMe) {
        localStorage.setItem(
          REMEMBERED_LOGIN_KEY,
          encryptData({
            LOGIN_NAME,
            PASSWORD_USER_HDR
          })
        );
      } else {
        localStorage.removeItem(REMEMBERED_LOGIN_KEY);
      }

      await showToast('success', 'Login successful! Redirecting...');
      router.replace('/dashboard');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        await showToast('error', 'Login request timed out. Please try again.');
      } else if (error instanceof Error) {
        console.error('Login error:', error);
        await showToast('error', error.message || 'Check your credentials and try again.');
      } else {
        console.error('Login error:', error);
        await showToast('error', 'Check your credentials and try again.');
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-body bg-background selection:bg-primary/20">
      {/* Background Decoration (Matching Theme Colors) */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary rounded-full blur-[120px] opacity-50" />
      </div>

      {/* Atmospheric Hero Image */}
      <div
        className="absolute inset-0 z-0 opacity-[0.07] blur-[2px] pointer-events-none transition-opacity duration-1000"
        style={{ backgroundImage: "url('/login-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      <div className="relative z-10 w-full max-w-md px-6 py-4">
        {/* Branding Section */}
        <div className="flex flex-col items-center mb-4 group cursor-default animate-in fade-in slide-in-from-top-6 duration-1000">
          <div className="relative">
            <div className="bg-white/90 flex items-center justify-center backdrop-blur-xl p-4 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-white transform transition-all duration-1000 group-hover:scale-[1.02]">
              <img
                src="/assets/tbgs-logo.jpg"
                alt="Prime Harvest Logo"
                className="w-40 h-auto max-h-20 object-contain transition-transform duration-700"
              />
            </div>
            {/* Minimalist Professional Tagline */}
            <div className="mt-4 flex flex-col items-center gap-1.5 transform transition-all duration-700">
              <div className="h-1 w-10 bg-linear-to-r from-transparent via-primary/30 to-transparent rounded-full" />
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-primary/60">
                ERP MANAGEMENT SYSTEM * v1.0
              </p>
            </div>
          </div>
        </div>

        {/* Login Card (Using Theme Card Component) */}
        <div className="bg-card/80 backdrop-blur-2xl border border-border rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-300 hover:shadow-primary/5">
          <div className="mb-6">
            <h2 className="text-2xl font-display font-black text-foreground tracking-tight">Welcome Back</h2>
            <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">
              Secure access to your enterprise dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80 ml-1" htmlFor="login_name">
                Username or Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <User size={18} />
                </div>
                <input
                  id="login_name"
                  type="text"
                  placeholder="Admin"
                  value={formData.LOGIN_NAME}
                  onChange={(e) => setFormData({ ...formData, LOGIN_NAME: e.target.value })}
                  autoComplete="username"
                  required
                  disabled={isLoading}
                  className="block w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground/60 text-sm"
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
                  placeholder="********"
                  value={formData.PASSWORD_USER_HDR}
                  onChange={(e) => setFormData({ ...formData, PASSWORD_USER_HDR: e.target.value })}
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="block w-full pl-11 pr-12 py-3 bg-muted/30 border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground/60 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
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
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 transition-all cursor-pointer accent-primary"
                />
              </div>
              <label htmlFor="remember" className="ml-2 block text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                Remember Me
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-70 text-primary-foreground font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-2"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
            Copyright 2026 Vision Infotech Ltd. All rights reserved.
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
