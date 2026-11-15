'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AmanahNav from '@/components/amanah-nav';

type Profile = {
  username: string;
  display_name: string;
  bio: string;
  city: string;
  country: string;
  skills: string;
  interests: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('amanah_token');

    if (!token) {
      router.replace('/login');
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accounts/me/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then(async (response) => {
        if (response.status === 401) {
          sessionStorage.removeItem('amanah_token');
          router.replace('/login');
          return null;
        }

        if (!response.ok) {
          throw new Error('Could not load your profile.');
        }

        return response.json();
      })
      .then((data) => {
        if (data) setProfile(data);
      })
      .catch(() => setMessage('Unable to load your profile.'))
      .finally(() => setLoading(false));
  }, [router]);

  function updateField(field: keyof Profile, value: string) {
    setProfile((current) =>
      current ? { ...current, [field]: value } : current
    );
  }

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const token = sessionStorage.getItem('amanah_token');

    if (!token || !profile) {
      router.replace('/login');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/me/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            display_name: profile.display_name,
            bio: profile.bio,
            city: profile.city,
            country: profile.country,
            skills: profile.skills,
            interests: profile.interests,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Profile update failed.');
      }

      setProfile(data);
      setMessage('Your profile has been updated successfully.');
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Something went wrong.'
      );
    } finally {
      setSaving(false);
    }
  }


  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7f2]">
        <p className="text-emerald-900">Loading your AMANAH dashboard...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7f2] p-6">
        <p className="text-gray-700">
          {message || 'Your profile could not be loaded.'}
        </p>
      </main>
    );
  }

  const fields: {
    key: keyof Profile;
    label: string;
    multiline?: boolean;
  }[] = [
    { key: 'display_name', label: 'Display name' },
    { key: 'bio', label: 'About me', multiline: true },
    { key: 'city', label: 'City' },
    { key: 'country', label: 'Country' },
    { key: 'skills', label: 'My skills', multiline: true },
    { key: 'interests', label: 'My interests', multiline: true },
  ];

  return (
    <main className="min-h-screen bg-[#f5f7f2]">
      <AmanahNav />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <p className="font-semibold text-emerald-700">MEMBER DASHBOARD</p>
          <h2 className="mt-3 text-4xl font-bold text-emerald-950">
            Assalamu Alaikum, {profile.display_name || profile.username}!
          </h2>
          <p className="mt-3 text-gray-600">
            Your journey of learning, sharing and helping starts here.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <aside className="h-fit rounded-3xl bg-emerald-900 p-8 text-white">
            <div className="flex size-16 items-center justify-center rounded-full bg-white/15 text-2xl font-bold">
              {(profile.display_name || profile.username)
                .charAt(0)
                .toUpperCase()}
            </div>

            <h3 className="mt-5 text-2xl font-bold">
              {profile.display_name || profile.username}
            </h3>

            <p className="mt-2 text-sm text-emerald-100">
              @{profile.username}
            </p>

            <p className="mt-5 text-sm text-emerald-100">
              {profile.city || profile.country
                ? `${profile.city}${profile.city && profile.country ? ', ' : ''}${profile.country}`
                : 'Location not added'}
            </p>

            <div className="mt-8 border-t border-white/20 pt-5">
              <p className="text-sm text-emerald-100">
                One Ummah. One Network.
              </p>
              <p className="mt-1 font-semibold">Endless Good.</p>
            </div>
          </aside>

          <section id="profile" className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-emerald-950">
              Edit your profile
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Share your skills and interests with the community.
            </p>

            <form onSubmit={saveProfile} className="mt-8 space-y-5">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    {field.label}
                  </label>

                  {field.multiline ? (
                    <textarea
                      value={profile[field.key]}
                      onChange={(e) =>
                        updateField(field.key, e.target.value)
                      }
                      rows={3}
                      maxLength={field.key === 'bio' ? 500 : undefined}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-emerald-700"
                    />
                  ) : (
                    <input
                      value={profile[field.key]}
                      onChange={(e) =>
                        updateField(field.key, e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-emerald-700"
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-emerald-800 py-4 font-semibold text-white hover:bg-emerald-900 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save profile'}
              </button>
            </form>

            {message && (
              <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
                {message}
              </p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
