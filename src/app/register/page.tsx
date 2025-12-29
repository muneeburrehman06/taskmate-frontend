'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(''); // clear previous error

    // Frontend validation
    if (!form.name || !form.email || !form.password || !form.password_confirmation) {
      setError('All fields are required');
      return;
    }

    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await api('/register', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      localStorage.setItem('token', res.token);
      router.push('/tasks');
    } catch (err: any) {
      console.log('Register Error:', err);
      if (err?.errors) {
        const firstKey = Object.keys(err.errors)[0];
        setError(err.errors[firstKey][0]);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = (provider: 'google' | 'facebook') => {
    window.location.href = `http://127.0.0.1:8000/api/auth/${provider}/`;
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Start managing your tasks</p>

        {/* Error message */}
        {error && <div className="mb-4 rounded bg-red-100 text-red-700 px-3 py-2">{error}</div>}

        <input
          className="auth-input"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Confirm Password"
          value={form.password_confirmation}
          onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
        />

        <button
          onClick={submit}
          className="auth-btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <div className="divider my-4">OR</div>

        <button
          onClick={() => socialLogin('google')}
          className="auth-btn btn-google flex items-center justify-center gap-2 mb-3"
        >
          Continue with Google
        </button>

        <button
          onClick={() => socialLogin('facebook')}
          className="auth-btn btn-facebook flex items-center justify-center gap-2"
        >
          Continue with Facebook
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-[#ff2d20] font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
