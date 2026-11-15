'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Heart,
  UserRound,
  UserPlus,
  UserCheck,
  Clock,
  Check,
  X,
} from 'lucide-react';
import AmanahNav from '@/components/amanah-nav';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Member = {
  username: string;
  display_name: string;
  bio: string;
  city: string;
  country: string;
  skills: string;
  interests: string;
};

type Connection = {
  id: number;
  sender_username: string;
  receiver_username: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
};

type ConnectionAction = 'send' | 'accept' | 'reject' | 'cancel';

export default function MemberProfilePage({
  username,
}: {
  username: string;
}) {
  const [member, setMember] = useState<Member | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const token = sessionStorage.getItem('amanah_token');

      if (!token) {
        if (active) {
          setError('Please log in to view member profiles.');
          setLoading(false);
        }
        return;
      }

      try {
        const headers = {
          Authorization: `Token ${token}`,
        };

        const [profileResponse, connectionsResponse] = await Promise.all([
          fetch(
            `${API_URL}/api/accounts/members/${encodeURIComponent(username)}/`,
            { headers },
          ),
          fetch(`${API_URL}/api/accounts/connections/`, { headers }),
        ]);

        if (
          profileResponse.status === 401 ||
          connectionsResponse.status === 401
        ) {
          sessionStorage.removeItem('amanah_token');
          throw new Error('Your session has expired. Please log in again.');
        }

        if (profileResponse.status === 404) {
          throw new Error('Member profile not found.');
        }

        if (!profileResponse.ok) {
          throw new Error('Unable to load this member profile.');
        }

        if (!connectionsResponse.ok) {
          throw new Error('Unable to load connection information.');
        }

        const profileData =
          (await profileResponse.json()) as Member;

        const connectionsData =
          (await connectionsResponse.json()) as Connection[];

        const memberConnection =
          connectionsData.find(
            (item) =>
              item.sender_username === username ||
              item.receiver_username === username,
          ) ?? null;

        if (active) {
          setMember(profileData);
          setConnection(memberConnection);
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Something went wrong.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, [username]);

  async function performConnectionAction(action: ConnectionAction) {
    const token = sessionStorage.getItem('amanah_token');

    if (!token) {
      setActionError('Please log in to manage connections.');
      return;
    }

    setActionLoading(true);
    setActionError('');

    try {
      const url =
        action === 'send'
          ? `${API_URL}/api/accounts/connections/`
          : `${API_URL}/api/accounts/connections/${connection?.id}/${action}/`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        ...(action === 'send'
          ? { body: JSON.stringify({ username }) }
          : {}),
      });

      const data = await response.json();

      if (response.status === 401) {
        sessionStorage.removeItem('amanah_token');
        throw new Error('Your session has expired. Please log in again.');
      }

      if (!response.ok) {
        throw new Error(
          data.error || data.detail || 'Connection action failed.',
        );
      }

      if (action === 'cancel') {
        setConnection(null);
      } else {
        setConnection(data as Connection);
      }
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : 'Something went wrong.',
      );
    } finally {
      setActionLoading(false);
    }
  }

  function renderConnectionButton() {
    if (connection?.status === 'accepted') {
      return (
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 rounded-xl bg-[#e8f2eb] px-5 py-3 text-sm font-bold text-[#07543d]"
        >
          <UserCheck size={18} />
          Connected
        </button>
      );
    }

    if (connection?.status === 'pending') {
      if (connection.sender_username === username) {
        return (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => performConnectionAction('accept')}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#07543d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#06422f] disabled:opacity-50"
            >
              <Check size={18} />
              Accept
            </button>

            <button
              type="button"
              onClick={() => performConnectionAction('reject')}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
            >
              <X size={18} />
              Reject
            </button>
          </div>
        );
      }

      return (
        <button
          type="button"
          onClick={() => performConnectionAction('cancel')}
          disabled={actionLoading}
          className="inline-flex items-center gap-2 rounded-xl border border-[#dce5dc] bg-white px-5 py-3 text-sm font-bold text-[#64756b] transition hover:bg-[#f6f8f3] disabled:opacity-50"
        >
          <Clock size={18} />
          {actionLoading ? 'Please wait...' : 'Request sent · Cancel'}
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => performConnectionAction('send')}
        disabled={actionLoading}
        className="inline-flex items-center gap-2 rounded-xl bg-[#07543d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#06422f] disabled:opacity-50"
      >
        <UserPlus size={18} />
        {actionLoading ? 'Please wait...' : 'Connect'}
      </button>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#163c30]">
      <AmanahNav />

      <div className="mx-auto max-w-3xl px-5 py-10">
        <Link
          href="/explore"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#07543d] transition hover:text-[#a17b36]"
        >
          <ArrowLeft size={18} />
          Back to Explore
        </Link>

        {loading && (
          <div className="rounded-2xl border border-[#e5e9df] bg-white p-10 text-center text-[#64756b]">
            Loading member profile...
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {!loading && member && (
          <div className="overflow-hidden rounded-3xl border border-[#e5e9df] bg-white shadow-sm">
            <div className="bg-[#07543d] px-7 py-10 text-white sm:px-10">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-3xl font-bold uppercase text-[#07543d]">
                {member.display_name.slice(0, 1)}
              </div>

              <h1 className="mt-5 text-3xl font-bold">
                {member.display_name}
              </h1>

              <p className="mt-1 text-sm text-white/70">
                @{member.username}
              </p>

              {(member.city || member.country) && (
                <p className="mt-4 flex items-center gap-2 text-sm text-white/80">
                  <MapPin size={16} />
                  {[member.city, member.country].filter(Boolean).join(', ')}
                </p>
              )}
            </div>

            <div className="space-y-8 p-7 sm:p-10">
              <section>
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <UserRound size={19} className="text-[#a17b36]" />
                  About
                </h2>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#64756b]">
                  {member.bio || 'This member has not added a bio yet.'}
                </p>
              </section>

              <section>
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Briefcase size={19} className="text-[#07543d]" />
                  Skills
                </h2>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#64756b]">
                  {member.skills || 'No skills added yet.'}
                </p>
              </section>

              <section>
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Heart size={19} className="text-[#a17b36]" />
                  Interests
                </h2>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#64756b]">
                  {member.interests || 'No interests added yet.'}
                </p>
              </section>

              <section className="border-t border-[#e5e9df] pt-7">
                <h2 className="mb-4 text-lg font-bold">
                  Community Connection
                </h2>

                {renderConnectionButton()}

                {actionError && (
                  <p role="alert" className="mt-3 text-sm text-red-600">
                    {actionError}
                  </p>
                )}
              </section>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
