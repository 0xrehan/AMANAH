'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/register/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errors = Object.values(data).flat().join(' ');
        throw new Error(errors || 'Registration failed.');
      }

      setMessage('Account created successfully! You can now log in.');

      setForm({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
      });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7f2] px-5 py-12">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl sm:p-12">
        <Link
          href="/"
          className="text-sm font-semibold text-emerald-800"
        >
          ← Back to AMANAH
        </Link>

        <h1 className="mt-8 text-4xl font-bold text-emerald-950">
          Join AMANAH
        </h1>

        <p className="mt-3 text-gray-600">
          One Ummah. One Network. Endless Good.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {[
            { name: 'first_name', label: 'First name', type: 'text' },
            { name: 'last_name', label: 'Last name', type: 'text' },
            { name: 'username', label: 'Username', type: 'text' },
            { name: 'email', label: 'Email address', type: 'email' },
            { name: 'password', label: 'Password', type: 'password' },
          ].map((field) => (
            <div key={field.name}>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {field.label}
              </label>

              <input
                name={field.name}
                type={field.type}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                required
                autoComplete={
                  field.name === 'password'
                    ? 'new-password'
                    : field.name === 'email'
                      ? 'email'
                      : 'off'
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-800 py-4 font-semibold text-white transition hover:bg-emerald-900 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create free account'}
          </button>
        </form>

        {message && (
          <p
            role="status"
            className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900"
          >
            {message}
          </p>
        )}

        <p className="mt-7 text-center text-sm text-gray-600">
          Already a member?{' '}
          <Link
            href="/login"
            className="font-semibold text-emerald-800"
          >
            Log in
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-gray-400">
          Free access. No subscriptions. No advertisements.
        </p>
      </div>
    </main>
  );
}
