'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    api('/user', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setName(res.name || '');
        setEmail(res.email || '');
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async () => {
    setError('');
    setSuccess('');

    if (!name || !email) {
      setError('Name and email are required');
      return;
    }

    if (password && password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    try {
      await api('/user/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name,
          email,
          ...(password ? { password, password_confirmation: passwordConfirmation } : {}),
        }),
      });

      setSuccess('Profile updated successfully');
      setPassword('');
      setPasswordConfirmation('');
    } catch {
      setError('Failed to update profile');
    }
  };

  if (loading) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#FF2D20] mb-6">
        Update Profile
      </h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <div className="bg-white shadow rounded p-6">
        <label className="block mb-2 font-semibold">Name</label>
        <input
          className="border p-2 w-full mb-4"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          className="border p-2 w-full mb-4"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label className="block mb-2 font-semibold">
          New Password <span className="text-sm text-gray-500">(optional)</span>
        </label>
        <input
          type="password"
          className="border p-2 w-full mb-4"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <label className="block mb-2 font-semibold">Confirm Password</label>
        <input
          type="password"
          className="border p-2 w-full mb-6"
          value={passwordConfirmation}
          onChange={e => setPasswordConfirmation(e.target.value)}
        />

        <div className="flex justify-between">
          <button
            onClick={() => router.push('/tasks')}
            className="border border-[#FF2D20] text-[#FF2D20] px-4 py-2 rounded hover:bg-[#FF2D20] hover:text-white transition"
          >
            Back
          </button>

          <button
            onClick={updateProfile}
            className="bg-[#FF2D20] text-white px-6 py-2 rounded hover:opacity-90"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
