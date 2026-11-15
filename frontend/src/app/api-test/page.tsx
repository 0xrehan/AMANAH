'use client';

import { useEffect, useState } from 'react';

export default function ApiTestPage() {
  const [message, setMessage] = useState('Connecting to AMANAH...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/health/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Backend returned an error');
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
      })
      .catch(() => {
        setMessage('Could not connect to Django backend.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7f2] p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-emerald-900">
          AMANAH
        </h1>

        <p className="mt-3 text-gray-600">
          Frontend and Backend Connection Test
        </p>

        <div className="mt-8 rounded-xl bg-emerald-50 p-5">
          <p className="font-semibold text-emerald-900">
            {loading ? 'Connecting...' : message}
          </p>
        </div>

        <p className="mt-5 text-sm text-gray-500">
          Django API: localhost:8000
        </p>
      </div>
    </main>
  );
}
