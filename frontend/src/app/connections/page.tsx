'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  UserCheck,
  Clock,
  Check,
  X,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import AmanahNav from '@/components/amanah-nav';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Connection = {
  id: number;
  sender_username: string;
  receiver_username: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
};

type Profile = {
  username: string;
};

export default function ConnectionsPage() {
  const [username, setUsername] = useState('');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const loadConnections = useCallback(async () => {
    const token = sessionStorage.getItem('amanah_token');

    if (!token) {
      setError('Please log in to view your connections.');
      setLoading(false);
      return;
    }

    try {
      const headers = {
        Authorization: `Token ${token}`,
      };

      const [profileResponse, connectionsResponse] = await Promise.all([
        fetch(`${API_URL}/api/accounts/me/`, { headers }),
        fetch(`${API_URL}/api/accounts/connections/`, { headers }),
      ]);

      if (
        profileResponse.status === 401 ||
        connectionsResponse.status === 401
      ) {
        sessionStorage.removeItem('amanah_token');
        throw new Error('Your session has expired. Please log in again.');
      }

      if (!profileResponse.ok || !connectionsResponse.ok) {
        throw new Error('Unable to load your connections.');
      }

      const profile = (await profileResponse.json()) as Profile;
      const data = (await connectionsResponse.json()) as Connection[];

      setUsername(profile.username);
      setConnections(data);
      setError('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadConnections();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadConnections]);

  async function handleAction(
    connection: Connection,
    action: 'accept' | 'reject' | 'cancel',
  ) {
    const token = sessionStorage.getItem('amanah_token');

    if (!token) {
      setError('Please log in to manage connection requests.');
      return;
    }

    setBusyId(connection.id);
    setError('');
    setActionMessage('');

    try {
      const response = await fetch(
        `${API_URL}/api/accounts/connections/${connection.id}/${action}/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();

      if (response.status === 401) {
        sessionStorage.removeItem('amanah_token');
        throw new Error('Your session has expired. Please log in again.');
      }

      if (!response.ok) {
        throw new Error(
          data.error || data.detail || 'Unable to complete this action.',
        );
      }

      if (action === 'cancel') {
        setConnections((current) =>
          current.filter((item) => item.id !== connection.id),
        );
        setActionMessage('Connection request cancelled.');
      } else {
        setConnections((current) =>
          current.map((item) =>
            item.id === connection.id ? (data as Connection) : item,
          ),
        );
        setActionMessage(
          action === 'accept'
            ? 'Connection accepted successfully!'
            : 'Connection request rejected.',
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong.',
      );
    } finally {
      setBusyId(null);
    }
  }

  const incoming = connections.filter(
    (item) =>
      item.receiver_username === username && item.status === 'pending',
  );

  const sent = connections.filter(
    (item) =>
      item.sender_username === username && item.status === 'pending',
  );

  const accepted = connections.filter(
    (item) => item.status === 'accepted',
  );

  const rejected = connections.filter(
    (item) => item.status === 'rejected',
  );

  function otherMember(connection: Connection) {
    return connection.sender_username === username
      ? connection.receiver_username
      : connection.sender_username;
  }

  function renderMemberCard({
    connection,
    section,
  }: {
    connection: Connection;
    section: 'incoming' | 'sent' | 'accepted' | 'rejected';
  }) {
    const member = otherMember(connection);
    const isBusy = busyId === connection.id;

    return (
      <article className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e5e9df] bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8f2eb] text-[#07543d]">
            <Users size={22} />
          </div>

          <div>
            <Link
              href={`/explore/${encodeURIComponent(member)}`}
              className="font-bold text-[#163c30] hover:text-[#08704d]"
            >
              @{member}
            </Link>

            <p className="mt-1 text-xs text-[#758278]">
              {section === 'incoming' && 'Sent you a connection request'}
              {section === 'sent' && 'Your request is waiting for a response'}
              {section === 'accepted' && 'You are connected'}
              {section === 'rejected' && 'Request was rejected'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {section === 'incoming' && (
            <>
              <button
                type="button"
                disabled={isBusy}
                onClick={() => handleAction(connection, 'accept')}
                className="flex items-center gap-2 rounded-xl bg-[#07543d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064431] disabled:opacity-50"
              >
                <Check size={16} />
                Accept
              </button>

              <button
                type="button"
                disabled={isBusy}
                onClick={() => handleAction(connection, 'reject')}
                className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
              >
                <X size={16} />
                Reject
              </button>
            </>
          )}

          {section === 'sent' && (
            <button
              type="button"
              disabled={isBusy}
              onClick={() => handleAction(connection, 'cancel')}
              className="rounded-xl border border-[#e1e7df] px-4 py-2.5 text-sm font-semibold text-[#53645a] transition hover:bg-[#f7f8f5] disabled:opacity-50"
            >
              Cancel request
            </button>
          )}

          {section === 'accepted' && (
            <span className="flex items-center gap-2 rounded-xl bg-[#e8f2eb] px-4 py-2.5 text-sm font-semibold text-[#07543d]">
              <UserCheck size={17} />
              Connected
            </span>
          )}

          {section === 'rejected' && (
            <span className="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-600">
              Rejected
            </span>
          )}

          {isBusy && (
            <span className="text-xs text-[#758278]">Processing...</span>
          )}
        </div>
      </article>
    );
  }

  function renderSection({
    title,
    icon,
    items,
    section,
    emptyText,
  }: {
    title: string;
    icon: React.ReactNode;
    items: Connection[];
    section: 'incoming' | 'sent' | 'accepted' | 'rejected';
    emptyText: string;
  }) {
    return (
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#07543d]">{icon}</span>
            <h2 className="text-lg font-bold text-[#163c30]">{title}</h2>
          </div>
          <span className="rounded-full bg-[#e8f2eb] px-3 py-1 text-sm font-bold text-[#07543d]">
            {items.length}
          </span>
        </div>

        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((connection) => (
              <div key={connection.id}>{renderMemberCard({ connection, section })}</div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#dce4da] bg-white/70 px-5 py-8 text-center text-sm text-[#758278]">
            {emptyText}
          </div>
        )}
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#163c30]">
      <AmanahNav />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#64756b] transition hover:text-[#07543d]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-8 rounded-3xl bg-[#07543d] p-7 text-white sm:p-9">
          <div className="mb-3 flex items-center gap-3">
            <UserPlus size={27} />
            <span className="text-sm font-semibold tracking-widest text-[#c9dfd0]">
              YOUR COMMUNITY
            </span>
          </div>

          <h1 className="text-3xl font-extrabold sm:text-4xl">
            My Connections
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#d5e6da] sm:text-base">
            Build meaningful relationships, connect with members, and grow
            together through the AMANAH community.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Connected', value: accepted.length },
              { label: 'Incoming', value: incoming.length },
              { label: 'Sent', value: sent.length },
              { label: 'Rejected', value: rejected.length },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/15 bg-white/10 p-4"
              >
                <p className="text-2xl font-extrabold">{item.value}</p>
                <p className="mt-1 text-xs text-[#d5e6da]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Manage your network</h2>
            <p className="mt-1 text-sm text-[#758278]">
              Your connection activity in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void loadConnections();
            }}
            disabled={loading}
            aria-label="Refresh connections"
            className="rounded-xl border border-[#e1e7df] bg-white p-3 text-[#07543d] transition hover:bg-[#e8f2eb] disabled:opacity-50"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {actionMessage && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-[#c9dfd0] bg-[#e8f2eb] p-4 text-sm font-medium text-[#07543d]"
          >
            {actionMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center text-[#758278]">
            Loading your connections...
          </div>
        ) : (
          <>
{renderSection({
              title: "Incoming Requests",
              icon: <UserPlus size={21} />,
              items: incoming,
              section: "incoming",
              emptyText: "You have no pending incoming requests.",
            })}

{renderSection({
              title: "Sent Requests",
              icon: <Clock size={21} />,
              items: sent,
              section: "sent",
              emptyText: "You have no pending sent requests.",
            })}

{renderSection({
              title: "Connected Members",
              icon: <UserCheck size={21} />,
              items: accepted,
              section: "accepted",
              emptyText: "You haven't connected with anyone yet. Explore members to get started.",
            })}

{renderSection({
              title: "Rejected Requests",
              icon: <X size={21} />,
              items: rejected,
              section: "rejected",
              emptyText: "No rejected requests.",
            })}
          </>
        )}
      </div>
    </main>
  );
}
