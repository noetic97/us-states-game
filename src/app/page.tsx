"use client";

import USStatesGame from "@/components/game/USStatesGame";

export default function Home() {
  return (
    <main className="h-screen p-6">
      <div className="h-full max-h-full flex items-center justify-center">
        <div className="w-full max-w-4xl h-full flex flex-col">
          <USStatesGame />
        </div>
      </div>
    </main>
  );
}
