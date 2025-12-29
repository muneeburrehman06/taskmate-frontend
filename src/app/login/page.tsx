'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    try {
      const res = await api('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem('token', res.token);
      router.push('/tasks');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const socialLogin = (provider: 'google' | 'facebook') => {
    window.location.href = `http://127.0.0.1:8000/api/auth/${provider}/`;
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Login to manage your tasks</p>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={submit} className="auth-btn btn-primary">
          Login
        </button>

        <div className="divider">OR</div>

        <button
          onClick={() => socialLogin('google')}
          className="auth-btn btn-google flex items-center justify-center gap-2 mb-3"
        >
          Continue with Google
        </button>

        <button
          onClick={() => socialLogin('facebook')}
          className="auth-btn btn-facebook"
        >
          Continue with Facebook
        </button>

        <p className="text-center text-sm mt-4">
          Don’t have an account? <a href="/register" className="text-[#ff2d20] font-semibold">Sign up</a>
        </p>
      </div>
    </div>
  );
}
