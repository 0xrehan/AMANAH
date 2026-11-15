'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Briefcase, Heart, Users } from 'lucide-react';
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

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const token = sessionStorage.getItem('amanah_token');

    if (!token) {
      Promise.resolve().then(() => {
        if (active) {
          setError('Please log in to explore community members.');
          setLoading(false);
        }
      });

      return () => {
        active = false;
      };
    }

    const params = new URLSearchParams();

    if (query.trim()) {
      params.set('search', query.trim());
    }

    const searchQuery = params.toString();
    const url = `${API_URL}/api/accounts/members/${searchQuery ? `?${searchQuery}` : ''}`;

    fetch(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then(async (response) => {
        if (response.status === 401) {
          sessionStorage.removeItem('amanah_token');
          throw new Error('Your session has expired. Please log in again.');
        }

        if (!response.ok) {
          throw new Error('Unable to load community members.');
        }

        return (await response.json()) as Member[];
      })
      .then((data) => {
        if (active) {
          setMembers(data);
          setError('');
        }
      })
      .catch((err: Error) => {
        if (active) {
          setError(err.message);
          setMembers([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [query]);

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#163c30]">
      <AmanahNav />

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a17b36]">
            AMANAH NETWORK
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Explore Members
          </h1>

          <p className="mt-3 text-[#64756b]">
            Discover people, skills and interests across our community.
          </p>
        </div>

        <div className="relative mb-8">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#829087]"
            size={20}
          />

          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLoading(true);
            }}
            placeholder="Search members, skills, interests or location..."
            aria-label="Search community members"
            className="w-full rounded-2xl border border-[#e1e8df] bg-white py-4 pl-12 pr-4 text-sm outline-none transition focus:border-[#07543d] focus:ring-2 focus:ring-[#07543d]/10"
          />
        </div>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Community Members</h2>

          {!loading && !error && (
            <span className="text-sm text-[#758279]">
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </span>
          )}
        </div>

        {loading && (
          <div className="rounded-2xl border border-[#e5e9df] bg-white p-8 text-center text-[#64756b]">
            Loading community members...
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {!loading && !error && members.length === 0 && (
          <div className="rounded-2xl border border-[#e5e9df] bg-white px-6 py-12 text-center">
            <Users className="mx-auto mb-3 text-[#a17b36]" size={34} />

            <h3 className="font-bold">No members found</h3>

            <p className="mt-2 text-sm text-[#758279]">
              Try another search term or check back later.
            </p>
          </div>
        )}

        {!loading && !error && members.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {members.map((member) => (
              <Link
                href={`/explore/${encodeURIComponent(member.username)}`}
                key={member.username}
                className="block rounded-2xl border border-[#e5e9df] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#07543d]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#e8f2eb] text-xl font-bold uppercase text-[#07543d]">
                    {member.display_name.slice(0, 1)}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold">
                      {member.display_name}
                    </h3>

                    <p className="text-sm text-[#829087]">
                      @{member.username}
                    </p>
                  </div>
                </div>

                {member.bio && (
                  <p className="mt-4 text-sm leading-6 text-[#64756b]">
                    {member.bio}
                  </p>
                )}

                {(member.city || member.country) && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-[#64756b]">
                    <MapPin size={16} className="shrink-0 text-[#a17b36]" />
                    {[member.city, member.country].filter(Boolean).join(', ')}
                  </div>
                )}

                {member.skills && (
                  <div className="mt-4 flex items-start gap-2">
                    <Briefcase
                      size={17}
                      className="mt-0.5 shrink-0 text-[#07543d]"
                    />

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#829087]">
                        Skills
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-[#163c30]">
                        {member.skills}
                      </p>
                    </div>
                  </div>
                )}

                {member.interests && (
                  <div className="mt-4 flex items-start gap-2">
                    <Heart
                      size={17}
                      className="mt-0.5 shrink-0 text-[#a17b36]"
                    />

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#829087]">
                        Interests
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-[#163c30]">
                        {member.interests}
                      </p>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
