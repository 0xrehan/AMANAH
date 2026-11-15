import { Suspense } from 'react';
import MemberProfilePage from './member-profile-client';

type PageProps = {
  params: Promise<{
    username: string;
  }>;
};

async function MemberProfileRoute({ params }: PageProps) {
  const { username } = await params;

  return <MemberProfilePage username={username} />;
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f6f8f3] p-10 text-center text-[#64756b]">
          Loading member profile...
        </main>
      }
    >
      <MemberProfileRoute params={params} />
    </Suspense>
  );
}
