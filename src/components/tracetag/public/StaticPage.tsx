import { ReactNode } from 'react';
import { PublicHeader, PublicFooter } from '@/components/tracetag/shared/Layout';
import { useDocTitle } from '@/components/tracetag/shared/useAuth';

export function StaticPage({ title, children }: { title: string; children: ReactNode }) {
  useDocTitle(`${title} — TraceTag Nigeria`);
  return (
    <div className="tracetag bg-white min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full prose prose-slate">
        <h1 className="text-3xl font-bold text-tt-navy mb-6">{title}</h1>
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
