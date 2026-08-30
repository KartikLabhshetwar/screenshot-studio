'use client';

import dynamic from 'next/dynamic';

const CodeImageEditor = dynamic(
  () => import('./CodeImageEditor').then((m) => m.CodeImageEditor),
  { ssr: false, loading: () => <CodeImageEditorSkeleton /> },
);

function CodeImageEditorSkeleton() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#181818]">
      <div className="h-[50px] shrink-0 border-b border-white/[0.06]" />
      <div className="flex min-h-[calc(100dvh-50px)] flex-1 items-center justify-center px-6 pb-32 pt-10">
        <div className="h-[420px] w-[700px] max-w-full animate-pulse rounded-xl bg-white/[0.04]" />
      </div>
    </div>
  );
}

export function CodeImageEditorLoader() {
  return <CodeImageEditor />;
}
