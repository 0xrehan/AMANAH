'use client';

import { useCallback, useEffect, useState } from 'react';
import AmanahNav from '@/components/amanah-nav';

type Post = {
  id: number;
  username: string;
  display_name: string;
  content: string;
  created_at: string;
  updated_at: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState('');

  const loadPosts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/community/posts/`);
      if (!response.ok) throw new Error('Could not load community posts.');

      const data: Post[] = await response.json();
      setPosts(data);
    } catch {
      setMessage('Unable to connect to the community feed.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    fetch(`${API_URL}/api/community/posts/`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Could not load community posts.');
        }
        return (await response.json()) as Post[];
      })
      .then((data) => {
        if (active) setPosts(data);
      })
      .catch(() => {
        if (active) setMessage('Unable to connect to the community feed.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function createPost() {
    const content = text.trim();
    if (!content) {
      setMessage('Please write something before posting.');
      return;
    }

    const token = sessionStorage.getItem('amanah_token');
    if (!token) {
      setMessage('Please log in before creating a post.');
      return;
    }

    setPosting(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/api/community/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.content?.[0] || 'Unable to publish your post.'
        );
      }

      setPosts((current) => [data, ...current]);
      setText('');
      setMessage('Your post has been published!');
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Something went wrong.'
      );
    } finally {
      setPosting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f8f3] px-4 py-10 text-[#163c30]">
      <AmanahNav />
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#a17b36]">
            AMANAH COMMUNITY
          </p>
          <h1 className="mt-2 text-3xl font-bold">Community Feed</h1>
          <p className="mt-2 text-sm text-[#64756b]">
            Share knowledge, encouragement and goodness with the community.
          </p>
        </header>

        <section className="rounded-2xl border border-[#e5e9df] bg-white p-5 shadow-sm">
          <label htmlFor="post-content" className="mb-3 block font-semibold">
            Share something good
          </label>

          <textarea
            id="post-content"
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={2000}
            placeholder="Write your thoughts, knowledge or something inspiring..."
            className="min-h-32 w-full resize-y rounded-xl border border-[#dce4d9] bg-[#fbfcf8] p-4 text-sm outline-none transition focus:border-[#287354] focus:ring-2 focus:ring-[#287354]/10"
          />

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-[#829087]">
              {text.length}/2000
            </span>

            <button
              onClick={createPost}
              disabled={posting || !text.trim()}
              className="rounded-xl bg-[#176044] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#104a34] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {posting ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>

          {message && (
            <p role="status" className="mt-3 text-sm text-[#287354]">
              {message}
            </p>
          )}
        </section>

        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">Latest Posts</h2>
            <button
              onClick={() => {
                setLoading(true);
                setMessage('');
                void loadPosts();
              }}
              className="text-sm font-semibold text-[#287354] hover:underline"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="py-10 text-center text-sm text-[#829087]">
              Loading community posts...
            </p>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#cbd8ca] bg-white p-10 text-center">
              <p className="text-lg font-semibold">A fresh beginning 🌱</p>
              <p className="mt-2 text-sm text-[#829087]">
                No posts yet. Be the first to share something good.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl border border-[#e5e9df] bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6f0e5] font-bold text-[#176044]">
                      {(post.display_name || post.username)
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold">
                        {post.display_name || post.username}
                      </p>
                      <p className="text-xs text-[#829087]">
                        @{post.username} ·{' '}
                        {new Date(post.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#344c40]">
                    {post.content}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
