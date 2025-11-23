"use client"

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const sampleProfile = {
  name: "John Doe",
  username: "john_doe",
  avatar: "/avatar-placeholder.png",
  streak: 12,
  havocWon: 120,
  duelsWon: 98,
  questionsSolved: {
    algorithms: 240,
    sorting: 132,
    greedy: 58,
    dp: 76,
    graphs: 45,
    trees: 30,
  },
};

const COLORS = ["#06b6d4", "#f97316"];

export default function ProfilePage({ profile = sampleProfile }) {
  const { name, username, avatar, streak, havocWon, duelsWon, questionsSolved } = profile;

  const totalWins = havocWon + duelsWon;

  const pieData = [
    { name: "Duels", value: duelsWon },
    { name: "Havoc", value: havocWon },
  ];

  const DSA_WHITELIST = new Set(["algorithms", "sorting", "greedy", "dp", "graphs", "trees"]);
  const dsaEntries = Object.entries(questionsSolved || {})
    .map(([k, v]) => [k.toLowerCase(), v])
    .filter(([k]) => DSA_WHITELIST.has(k));

  const topDsa = dsaEntries.sort((a, b) => b[1] - a[1]).slice(0, 4);
  const maxSolved = topDsa.length ? Math.max(...topDsa.map(([, c]) => c)) : 1;

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-start gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-56 h-56 rounded-2xl overflow-hidden">
              <Avatar className="w-full h-full">
                <AvatarImage src={avatar} alt={`${name} avatar`} />
                <AvatarFallback className="text-4xl">{name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Name + Stats */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-extrabold leading-tight">{name}</h1>
              <div className="mt-1 text-sm text-zinc-400">{username}</div>

              <div className="mt-6 flex items-center gap-4">
                <Card className="bg-zinc-800 border border-zinc-700 p-4 w-48">
                  <CardHeader>
                    <CardTitle className="text-sm text-zinc-400">Streak</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{streak}</div>
                    <div className="text-xs text-zinc-500 mt-1">days active</div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-800 border border-zinc-700 p-4 w-56">
                  <CardHeader>
                    <CardTitle className="text-sm text-zinc-400">Wins (total)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-4">
                      <div className="text-2xl font-semibold text-white">{totalWins}</div>
                      <div className="text-sm text-zinc-400">
                        {duelsWon} duels • {havocWon} havoc
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>

            {/* Pie chart */}
            <div className="mt-6 w-44 h-44 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <div className="w-36 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={38}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </header>

        {/* Lower Section */}
        <main className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Questions Solved */}
          <section className="md:col-span-2">
            <Card className="bg-zinc-800 border border-zinc-700">
              <CardHeader>
                <CardTitle className="text-white">Questions Solved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {topDsa.map(([category, count]) => (
                    <div key={category} className="flex items-center gap-4">
                      <div className="w-36 text-sm text-zinc-400 font-medium capitalize">
                        {category}
                      </div>
                      <div className="flex-1 text-sm text-white">{count} solved</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Right Sidebar */}
          <aside className="space-y-4">
            <Card className="bg-zinc-800 border border-zinc-700 p-4">
              <CardHeader>
                <CardTitle className="text-white">Win Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-zinc-400">Duels</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-2xl font-semibold text-white">{duelsWon}</div>
                  <div className="text-xs text-zinc-500">
                    {Math.round((duelsWon / totalWins) * 100)}%
                  </div>
                </div>

                <div className="h-px bg-zinc-800 my-4" />

                <div className="text-sm text-zinc-400">Havoc</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-2xl font-semibold text-white">{havocWon}</div>
                  <div className="text-xs text-zinc-500">
                    {Math.round((havocWon / totalWins) * 100)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </main>
      </div>
    </div>
  );
}
