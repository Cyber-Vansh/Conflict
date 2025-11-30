"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Trophy,
    ArrowLeft,
    Medal,
    Crown,
    Target,
    Swords,
    Users,
    Search,
    UserPlus,
    Check
} from "lucide-react";
import api from "@/app/api";
import { toast } from "sonner";

export default function LeaderboardPage() {
    const router = useRouter();
    const [mode, setMode] = useState("duels");
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [sentRequests, setSentRequests] = useState([]);

    const handleAddFriend = async (userId) => {
        try {
            await api.post("/friends/request", { userId });
            toast.success("Friend request sent!");
            setSentRequests([...sentRequests, userId]);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setSentRequests([...sentRequests, userId]);
                toast.info("Friend request already sent");
            } else {
                console.error("Error sending friend request:", error);
                toast.error("Failed to send friend request");
            }
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        fetchLeaderboard();
    }, [mode]);

    const fetchCurrentUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const response = await api.get("/auth/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCurrentUser(response.data.data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/leaderboard/global?type=${mode}`);
            setLeaderboard(response.data.data || []);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLeaderboard = leaderboard.filter(player =>
        player.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRankStyle = (rank) => {
        switch (rank) {
            case 1: return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
            case 2: return "bg-neutral-300/20 text-neutral-300 border-neutral-300/50";
            case 3: return "bg-amber-700/20 text-amber-700 border-amber-700/50";
            default: return "bg-neutral-800 text-neutral-400 border-neutral-700";
        }
    };

    const getTrophyIcon = (rank) => {
        switch (rank) {
            case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
            case 2: return <Medal className="w-5 h-5 text-neutral-300" />;
            case 3: return <Medal className="w-5 h-5 text-amber-700" />;
            default: return <span className="w-5 h-5 block text-center font-bold text-neutral-500">#</span>;
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white pb-12">
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push("/")}
                            className="rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <Trophy className="w-8 h-8 text-yellow-500" />
                                Leaderboard
                            </h1>
                            <p className="text-neutral-400 mt-1">Top players in the arena</p>
                        </div>
                    </div>

                    <div className="flex items-center bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                        <button
                            onClick={() => setMode("duels")}
                            className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${mode === "duels"
                                ? "bg-emerald-600 text-white shadow-lg"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                                }`}
                        >
                            <Swords className="w-4 h-4" />
                            Duels
                        </button>
                        <button
                            onClick={() => setMode("havoc")}
                            className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${mode === "havoc"
                                ? "bg-emerald-600 text-white shadow-lg"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            Havoc
                        </button>
                    </div>
                </div>

                <div className="mb-8 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                        type="text"
                        placeholder="Search players..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
                    />
                </div>

                <Card className="bg-neutral-900/50 border-neutral-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-neutral-800 bg-neutral-900/50">
                                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider w-24">Rank</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Player</th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-neutral-400 uppercase tracking-wider">Crowns</th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-neutral-400 uppercase tracking-wider">Win Rate</th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-neutral-400 uppercase tracking-wider">Battles</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-8 w-8 bg-neutral-800 rounded mx-auto" /></td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-neutral-800 rounded-full" />
                                                    <div className="h-4 w-32 bg-neutral-800 rounded" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><div className="h-4 w-16 bg-neutral-800 rounded mx-auto" /></td>
                                            <td className="px-6 py-4"><div className="h-4 w-16 bg-neutral-800 rounded mx-auto" /></td>
                                            <td className="px-6 py-4"><div className="h-4 w-16 bg-neutral-800 rounded mx-auto" /></td>
                                        </tr>
                                    ))
                                ) : filteredLeaderboard.length > 0 ? (
                                    filteredLeaderboard.map((player, index) => {
                                        const isCurrentUser = currentUser && player.id === currentUser.id;
                                        return (
                                            <tr
                                                key={player.id}
                                                className={`transition group ${isCurrentUser
                                                    ? "bg-emerald-500/10 hover:bg-emerald-500/20 border-l-4 border-l-emerald-500"
                                                    : "hover:bg-neutral-800/30 border-l-4 border-l-transparent"
                                                    }`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getRankStyle(index + 1)} font-bold`}>
                                                        {index + 1}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className={`h-10 w-10 border-2 transition ${isCurrentUser ? "border-emerald-500" : "border-neutral-800 group-hover:border-emerald-500/50"
                                                            }`}>
                                                            <AvatarImage src={player.avatar} />
                                                            <AvatarFallback className="bg-neutral-800 text-white font-medium">
                                                                {player.username?.[0]?.toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className={`font-medium transition ${isCurrentUser ? "text-emerald-400" : "text-white group-hover:text-emerald-400"
                                                            }`}>
                                                            {player.username} {isCurrentUser && "(You)"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex items-center justify-center gap-2 font-bold text-yellow-500">
                                                        <Crown className="w-4 h-4" />
                                                        {mode === "duels" ? player.dualsCrowns : player.havocCrowns}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex items-center justify-center gap-2 font-medium text-emerald-400">
                                                        <Target className="w-4 h-4" />
                                                        {Math.round((player.wins / (player.totalBattles || 1)) * 100)}%
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-neutral-400">
                                                    {player.totalBattles}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    {!isCurrentUser && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="hover:bg-emerald-500/10 hover:text-emerald-500"
                                                            onClick={() => handleAddFriend(player.id)}
                                                            disabled={sentRequests.includes(player.id)}
                                                        >
                                                            {sentRequests.includes(player.id) ? (
                                                                <Check className="w-4 h-4 text-emerald-500" />
                                                            ) : (
                                                                <UserPlus className="w-4 h-4" />
                                                            )}
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-neutral-500">
                                            No players found matching "{searchQuery}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
