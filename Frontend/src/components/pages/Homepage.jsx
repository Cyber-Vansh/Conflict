"use client"

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function Homepage() {
  const [leaderboardMode, setLeaderboardMode] = useState("duels");

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

  const activity = [
    "Aisha won a Duel against Rohan",
    "Dev reached a 10-match streak",
    "Maya unlocked 'Sharpshooter' trophy",
    "Kiran climbed to #1 in Havoc",
  ];

  const mode = leaderboardMode === "havoc" ? "havoc" : "duels";

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 md:p-12">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-72 h-24 rounded-lg border border-zinc-800 flex items-center justify-center">
            <span className="text-3xl font-extrabold text-white underline">CONFLICT</span>
          </div>

          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-white">Choose your mode — compete, climb, conquer.</h2>
            <p className="text-sm text-zinc-400">Fast 1v1 duels or chaotic Havoc.</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Trophy & Streak */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-lg bg-zinc-800 border border-yellow-500 text-yellow-400 text-sm font-semibold flex items-center gap-2">
              <span aria-hidden>🏆</span>
              <span>124</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-zinc-800 border border-blue-500 text-blue-400 text-sm font-semibold flex items-center gap-2">
              <span aria-hidden>🔥</span>
              <span>7</span>
            </div>
          </div>

          {/* Avatar */}
          <Button variant="ghost" className="p-0 rounded-full h-auto w-auto text-white hover:text-zinc-200">
            <Avatar>
              <AvatarImage src="/avatar-placeholder.png" alt="User Avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </header>

      <main className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2">
          <div className="rounded-2xl border border-zinc-700 p-8 shadow-sm bg-zinc-800">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">Choose your challenge</h1>
            <p className="mt-3 text-zinc-400 text-lg max-w-xl">
              Jump into fast-paced 1v1 Duels or embrace the chaos in Havoc. Earn trophies, keep streaks and climb the leaderboards.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Duels */}
              <Card className="p-4 bg-zinc-800 border border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Duels</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-400">Quick 1v1 matches.</p>
                  <div className="mt-4">
                    <Link href="/duelsmatchup">
                      <Button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white shadow-none border-none">
                        Play Duels
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Havoc */}
              <Card className="p-4 bg-zinc-800 border border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Havoc</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-400">Free-for-all chaos mode.</p>
                  <div className="mt-4">
                    <Link href="/havocmatchup">
                      <Button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white shadow-none border-none">
                        Play Havoc
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-10 flex flex-col gap-5 w-72">
              <Link href="/duelsmatchup">
                <Button className="w-full py-6 text-xl font-semibold bg-green-600 hover:bg-green-700 text-white shadow-none border-none">
                  Duels
                </Button>
              </Link>

              <Link href="/havocmatchup">
                <Button className="w-full py-6 text-xl font-semibold bg-green-600 hover:bg-green-700 text-white shadow-none border-none">
                  Havoc
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          {/* Leaderboard Panel */}
          <Card className="bg-zinc-800 border border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white">Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button
                  size="sm"
                  variant={mode === "duels" ? "default" : "ghost"}
                  className="text-white hover:text-zinc-200"
                  onClick={() => setLeaderboardMode("duels")}
                >
                  Duels
                </Button>

                <Button
                  size="sm"
                  variant={mode === "havoc" ? "default" : "ghost"}
                  className="text-white hover:text-zinc-200"
                  onClick={() => setLeaderboardMode("havoc")}
                >
                  Havoc
                </Button>
              </div>

              <ol className="space-y-3">
                {leaderboardData[mode].map((p) => (
                  <li key={p.rank} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 text-sm text-zinc-400">{"#" + p.rank}</div>
                      <div className="text-white font-medium">{p.name}</div>
                    </div>
                    <div className="text-zinc-400">{p.score.toLocaleString("en-GB")}</div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Activity Panel */}
          <Card className="bg-zinc-800 border border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-zinc-400">
                {activity.map((a, i) => (
                  <li key={i}>• {a}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Footer links */}
          <div className="mt-4 text-sm text-zinc-500">
            <nav className="flex gap-4">
              <a className="hover:text-zinc-200 cursor-pointer">About</a>
              <a className="hover:text-zinc-200 cursor-pointer">Leaderboards</a>
              <a className="hover:text-zinc-200 cursor-pointer">Help</a>
              <a className="hover:text-zinc-200 cursor-pointer">Discord</a>
            </nav>
          </div>
        </aside>
      </main>
    </div>
  );
}
