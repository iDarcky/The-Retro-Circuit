import React from 'react';
import AdventureGame from '@/components/adventure/AdventureGame';

export const metadata = {
  title: 'Text Adventure Game',
  description: 'A classic text-based adventure game.',
};

export default function AdventurePage() {
  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          The Quest for the Lost Artifact
        </h1>
        <AdventureGame />
      </div>
    </main>
  );
}
