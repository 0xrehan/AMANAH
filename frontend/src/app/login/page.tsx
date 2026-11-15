'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/login/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.non_field_errors?.[0] || 'Invalid username or password.');
      }

      // Development-only storage. We'll replace this with secure
      // HttpOnly cookie authentication before production.
      sessionStorage.setItem('amanah_token', data.token);

      router.push('/dashboard');
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Login failed.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7f2] px-5 py-12">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl sm:p-12">

        <Link href="/" className="text-sm font-semibold text-emerald-800">
          ← Back to AMANAH
        </Link>

        <h1 className="mt-8 text-4xl font-bold text-emerald-950">
          Welcome back
        </h1>

        <p className="mt-3 text-gray-600">
          Sign in and continue helping your community.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-800 py-4 font-semibold text-white transition hover:bg-emerald-900 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {message && (
          <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {message}
          </p>
        )}

        <p className="mt-7 text-center text-sm text-gray-600">
          New to AMANAH?{' '}
          <Link href="/register" className="font-semibold text-emerald-800">
            Create an account
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-gray-400">
          Free access. No subscriptions. No advertisements.
        </p>

      </div>
    </main>
  );
}
