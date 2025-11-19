"use client"

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function Home() {
  const [leaderboardMode, setLeaderboardMode] = useState("duels");

  // temporary data leaderboard ka
  const leaderboardData = {
    duels: [
      { rank: 1, name: "Aisha", score: 9820 },
      { rank: 2, name: "Rohan", score: 9430 },
      { rank: 3, name: "Maya", score: 8920 },
      { rank: 4, name: "Siddharth", score: 8430 },
    ],
    havoc: [
      { rank: 1, name: "Kiran", score: 12040 },
      { rank: 2, name: "Neel", score: 11820 },
      { rank: 3, name: "Isha", score: 11450 },
      { rank: 4, name: "Dev", score: 11000 },
    ],
  };

  const mode = leaderboardMode === "havoc" ? "havoc" : "duels";

  // ye bhi but remove karna h idk
  const activity = [
    "Aisha won a Duel against Rohan",
    "Dev reached a 10-match streak",
    "Maya unlocked 'Sharpshooter' trophy",
    "Kiran climbed to #1 in Havoc",
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 p-6 md:p-12">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-72 h-24 rounded-lg border-slate-300 flex items-center justify-center">
            <span className="text-3xl font-extrabold text-slate-700 underline">CONFLICT</span>
          </div>

          <div className="hidden md:block">
            <h2 className="text-lg font-semibold">Choose your mode — compete, climb, conquer.</h2>
            <p className="text-sm text-slate-500">Fast 1v1 duels or chaotic Havoc.</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-lg bg-white border border-yellow-300 text-yellow-600 text-sm font-semibold flex items-center gap-2">
              <span aria-hidden>🏆</span>
              <span>124</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-white border border-blue-300 text-blue-600 text-sm font-semibold flex items-center gap-2">
              <span aria-hidden>🔥</span>
              <span>7</span>
            </div>
          </div>

          <Button variant="ghost" className="p-0 rounded-full h-auto w-auto">
            <Avatar>
              <AvatarImage src="/avatar-placeholder.png" alt="User Avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </header>

      <main className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2">
          <div className="rounded-2xl border p-8  shadow-sm">
            <h1 className="text-4xl md:text-5xl font-extrabold  text-slate-800">Choose your challenge</h1>
            <p className="mt-3 text-slate-600 text-lg max-w-xl">Jump into fast-paced 1v1 Duels or embrace the chaos in Havoc. Earn trophies, keep streaks and climb the leaderboards.</p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="p-4">
                <CardHeader>
                  <CardTitle className="text-lg">Duels</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">Quick 1v1 matches.</p>
                  <div className="mt-4">
                    <Link href="/duelsmatchup">
                      <Button className="px-4 py-2 bg-white text-neutral-900 border hover:bg-neutral-900 hover:text-white shadow-none">
                        Play Duels
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4">
                <CardHeader>
                  <CardTitle className="text-lg">Havoc</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">Free-for-all chaos mode.</p>
                  <div className="mt-4">
                    <Link href="/havocmatchup">
                      <Button className="px-4 py-2 bg-white text-neutral-900 border hover:bg-neutral-900 hover:text-white shadow-none">Play Havoc</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-10 flex flex-col gap-5 w-72">
              <Button className="w-full py-6 text-xl font-semibold bg-white text-neutral-900 shadow-none hover:bg-neutral-900 hover:text-white">Duels</Button>
              <Button className="w-full py-6 text-xl font-semibold bg-white text-neutral-900 shadow-none hover:bg-neutral-900 hover:text-white">Havoc</Button>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <Card className="bg-white border-neutral-200">
            <CardHeader>
              <CardTitle className="text-neutral-900">Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button size="sm" variant={mode === "duels" ? "default" : "ghost"} onClick={() => setLeaderboardMode("duels")}>Duels</Button>
                <Link href="/havocmatchup">
                  <Button size="sm" variant={mode === "havoc" ? "default" : "ghost"} onClick={() => setLeaderboardMode("havoc")}>Havoc</Button>
                </Link>
              </div>

              <ol className="space-y-3">
                {leaderboardData[mode].map((p) => (
                  <li key={p.rank} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 text-sm text-slate-500">{"#" + p.rank}</div>
                      <div className="text-neutral-900 font-medium">{p.name}</div>
                    </div>
                    <div className="text-slate-500">{p.score.toLocaleString('en-GB')}</div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="bg-white border-neutral-200">
            <CardHeader>
              <CardTitle className="text-neutral-900">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                {activity.map((a, i) => (
                  <li key={i}>• {a}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="mt-4 text-sm text-slate-500">
            <nav className="flex gap-4">
              <a className="hover:underline">About</a>
              <a className="hover:underline">Leaderboards</a>
              <a className="hover:underline">Help</a>
              <a className="hover:underline">Discord</a>
            </nav>
          </div>
        </aside>
      </main>
    </div>
  );
}
