"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import api from "@/app/api";
import {
  Swords,
  Trophy,
  Flame,
  Crown,
  Users,
  TrendingUp,
  Target,
  Zap,
  Award,
  Activity,
  Medal,
  Star,
  Code2,

  Search,
  User,
  LogOut
} from "lucide-react";

export default function Homepage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [leaderboard, setLeaderboard] = useState({ duels: [], havoc: [] });
  const [leaderboardMode, setLeaderboardMode] = useState("duels");
  const [recentBattles, setRecentBattles] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const fetchData = async () => {
    try {

      const [profileRes, statsRes, duelsLeaderboardRes, havocLeaderboardRes] = await Promise.all([
        api.get("/auth/profile"),
        api.get("/auth/stats"),
        api.get("/leaderboard/global?type=duals&limit=5"),
        api.get("/leaderboard/global?type=havoc&limit=5"),
      ]);

      setUserData({
        ...profileRes.data.data,
        ...statsRes.data.data.user,
        recentBattles: statsRes.data.data.recentBattles || [],
      });

      setLeaderboard({
        duels: duelsLeaderboardRes.data.data || [],
        havoc: havocLeaderboardRes.data.data || [],
      });

      setRecentBattles(statsRes.data.data.recentBattles || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const mode = leaderboardMode === "havoc" ? "havoc" : "duels";

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const winRate = userData?.totalBattles > 0
    ? Math.round((userData.wins / userData.totalBattles) * 100)
    : 0;

  const getBattleTypeDisplay = (type) => {
    return type === 'DUALS' ? 'Duels' : type === 'HAVOC' ? 'Havoc' : type;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-0">

      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <Swords className="w-7 h-7 text-emerald-500" strokeWidth={2.5} />
              <span className="text-2xl font-bold text-white">CONFLICT</span>
            </div>
            <div className="hidden md:block h-6 w-px bg-neutral-700 mx-2" />
            <span className="hidden md:block text-sm text-neutral-400">Competitive Coding Arena</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 rounded-full border border-neutral-800">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="font-bold text-white">
                {(userData?.dualsCrowns || 0) + (userData?.havocCrowns || 0)}
              </span>
            </div>
            <Link href="/playground">
              <Button variant="outline" className="gap-2 bg-white text-black hover:bg-neutral-200 border-0">
                <Code2 className="w-4 h-4" />
                Playground
              </Button>
            </Link>
            <Link href="/friends">
              <Button variant="outline" className="gap-2 bg-neutral-900 text-white hover:bg-neutral-800 border-neutral-800">
                <Users className="w-4 h-4" />
                Friends
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-10 h-10 border-2 border-neutral-800 cursor-pointer hover:border-emerald-500 transition">
                  <AvatarImage src={userData?.avatar} />
                  <AvatarFallback className="bg-neutral-800 text-white">{userData?.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-neutral-900 border-neutral-800 text-white">
                <DropdownMenuItem className="cursor-pointer hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white" onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-neutral-800" />
                <DropdownMenuItem className="cursor-pointer hover:bg-neutral-800 focus:bg-neutral-800 text-red-500 hover:text-red-400 focus:text-red-400" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>





        <div className="space-y-6">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  Choose Your Battle
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link href="/duelsmatchup">
                    <Card className="group bg-neutral-900/50 border-neutral-800 hover:border-emerald-500 p-6 cursor-pointer transition-all hover:bg-neutral-900">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500/20 transition">
                          <Swords className="w-7 h-7 text-emerald-500" />
                        </div>
                        <div className="px-2.5 py-1 bg-neutral-800 rounded-md text-xs font-medium text-neutral-300">
                          1 vs 1
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold mb-2 text-white">Duels</h3>
                      <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
                        Face off against a single opponent in intense head-to-head combat.
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                        <div>
                          <div className="text-xs text-neutral-400">Your Crowns</div>
                          <div className="text-lg font-bold text-emerald-500">
                            {userData?.dualsCrowns || 0}
                          </div>
                        </div>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                          Play Now
                        </Button>
                      </div>
                    </Card>
                  </Link>

                  <Link href="/havocmatchup">
                    <Card className="group bg-neutral-900/50 border-neutral-800 hover:border-emerald-500 p-6 cursor-pointer transition-all hover:bg-neutral-900">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500/20 transition">
                          <Users className="w-7 h-7 text-emerald-500" />
                        </div>
                        <div className="px-2.5 py-1 bg-neutral-800 rounded-md text-xs font-medium text-neutral-300">
                          FFA
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold mb-2 text-white">Havoc</h3>
                      <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
                        Enter the chaos of free-for-all multiplayer battles.
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                        <div>
                          <div className="text-xs text-neutral-400">Your Crowns</div>
                          <div className="text-lg font-bold text-emerald-500">
                            {userData?.havocCrowns || 0}
                          </div>
                        </div>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                          Join Battle
                        </Button>
                      </div>
                    </Card>
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    Your Stats
                  </h2>
                  <Card className="bg-neutral-900/50 border-neutral-800 p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-800 flex flex-col justify-center items-center text-center gap-2 hover:border-emerald-500/50 transition group">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 mb-1">
                          <Crown className="w-5 h-5" />
                        </div>
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-medium">Crowns</div>
                        <div className="text-2xl font-bold text-white">
                          {(userData?.dualsCrowns || 0) + (userData?.havocCrowns || 0)}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-800 flex flex-col justify-center items-center text-center gap-2 hover:border-emerald-500/50 transition group">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 mb-1">
                          <Target className="w-5 h-5" />
                        </div>
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-medium">Win Rate</div>
                        <div className="text-2xl font-bold text-white">{winRate}%</div>
                      </div>

                      <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-800 flex flex-col justify-center items-center text-center gap-2 hover:border-emerald-500/50 transition group">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 mb-1">
                          <Trophy className="w-5 h-5" />
                        </div>
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-medium">Battles</div>
                        <div className="text-2xl font-bold text-white">{userData?.totalBattles || 0}</div>
                      </div>

                      <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-800 flex flex-col justify-center items-center text-center gap-2 hover:border-emerald-500/50 transition group">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 mb-1">
                          <Award className="w-5 h-5" />
                        </div>
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-medium">Wins</div>
                        <div className="text-2xl font-bold text-white">{userData?.wins || 0}</div>
                      </div>
                    </div>
                  </Card>
                </div>


              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex flex-col">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Activity className="w-5 h-5 text-emerald-500" />
                Recent Battles
              </h2>

              <Card className="bg-neutral-900/50 border-neutral-800 flex-1 flex flex-col">
                <div className="divide-y divide-neutral-800 flex-1">
                  {recentBattles.length > 0 ? (
                    recentBattles.slice(0, 6).map((battle, idx) => (
                      <div key={idx} className="p-4 hover:bg-neutral-800/50 transition flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${battle.rank === 1
                            ? 'bg-emerald-500/10 border border-emerald-500/20'
                            : 'bg-neutral-800'
                            }`}>
                            <span className="text-xl font-bold text-white">#{battle.rank}</span>
                          </div>
                          <div>
                            <div className="font-medium text-sm text-white">
                              {getBattleTypeDisplay(battle.battle.type)} • {battle.battle.mode}
                            </div>
                            <div className="text-xs text-neutral-400">
                              Score: {battle.score} points
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {battle.crownChange !== undefined && (
                            <div className={`text-sm font-medium px-3 py-1 rounded-md ${battle.crownChange > 0
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : battle.crownChange < 0
                                ? 'bg-red-500/10 text-red-500'
                                : 'bg-neutral-800 text-neutral-400'
                              }`}>
                              {battle.crownChange > 0 ? '+' : ''}{battle.crownChange}
                            </div>
                          )}
                          {battle.rank === 1 && (
                            <Medal className="w-6 h-6 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-neutral-400">
                      No battles yet. Start your first battle!
                    </div>
                  )}
                </div>
                <div className="p-4 pt-0 mt-auto border-t border-neutral-800">
                  <Link href="/profile">
                    <Button variant="ghost" className="w-full text-sm text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10">
                      View Full History
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-4 flex flex-col">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Leaderboard
              </h2>

              <Card className="bg-neutral-900/50 border-neutral-800 flex-1 flex flex-col">

                <div className="p-4 border-b border-neutral-800">
                  <div className="flex gap-2 p-1 bg-neutral-800/50 rounded-lg">
                    <button
                      onClick={() => setLeaderboardMode("duels")}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition ${mode === "duels"
                        ? "bg-emerald-600 text-white"
                        : "text-neutral-300 hover:text-white"
                        }`}
                    >
                      Duels
                    </button>
                    <button
                      onClick={() => setLeaderboardMode("havoc")}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition ${mode === "havoc"
                        ? "bg-emerald-600 text-white"
                        : "text-neutral-300 hover:text-white"
                        }`}
                    >
                      Havoc
                    </button>
                  </div>
                </div>


                <div className="p-4 space-y-3">
                  {leaderboard[mode].slice(0, 5).map((player) => (
                    <div
                      key={player.rank}
                      className="flex items-center gap-3 p-3 bg-neutral-800/30 hover:bg-neutral-800/50 rounded-lg transition"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${player.rank === 1 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                        player.rank === 2 ? "bg-neutral-400/20 text-neutral-200 border border-neutral-400/30" :
                          player.rank === 3 ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" :
                            "bg-neutral-700/50 text-neutral-300 border border-neutral-600/30"
                        }`}>
                        {player.rank}
                      </div>

                      <Avatar className="w-9 h-9 border border-neutral-700">
                        <AvatarImage src={player.avatar} />
                        <AvatarFallback className="bg-neutral-800 text-white text-xs">
                          {player.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate text-white">{player.username}</div>
                        <div className="text-xs text-neutral-400">
                          {mode === "duels" ? player.dualsCrowns : player.havocCrowns} crowns
                        </div>
                      </div>

                      {player.rank <= 3 && (
                        <Star className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-4 pt-0">
                  <Link href="/leaderboards">
                    <Button variant="ghost" className="w-full text-sm text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10">
                      View Full Rankings
                    </Button>
                  </Link>
                </div>
              </Card>

            </div>
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t border-neutral-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-neutral-500">
              © 2025 Conflict. Competitive Coding Platform.
            </div>
            <div className="flex gap-6 text-sm text-neutral-500">
              <a href="#" className="hover:text-emerald-500 transition">About</a>
              <a href="#" className="hover:text-emerald-500 transition">Help</a>
              <a href="#" className="hover:text-emerald-500 transition">Discord</a>
            </div>
          </div>
        </footer>
      </div>
    </div >
  );
}
