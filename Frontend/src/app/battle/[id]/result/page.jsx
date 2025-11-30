"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/app/api";
import { Trophy, Crown, Home, ArrowRight, Medal } from "lucide-react";
import { motion } from "framer-motion";

export default function BattleResultPage() {
    const router = useRouter();
    const params = useParams();
    const battleId = params.id;
    const [battle, setBattle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) setCurrentUser(JSON.parse(userStr));
        fetchBattleResult();
    }, [battleId]);

    const fetchBattleResult = async () => {
        try {
            const response = await api.get(`/battles/${battleId}`);
            const data = response.data.data;
            setBattle(data);

            if (data.status !== "COMPLETED") {
                setTimeout(fetchBattleResult, 1000);
            }
        } catch (error) {
            console.error("Error fetching battle result:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!battle) return null;

    if (battle.status !== "COMPLETED") {
        return (
            <div className="min-h-screen bg-neutral-950 text-white p-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <div className="animate-pulse inline-block p-3 rounded-full bg-emerald-500/10 mb-4">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                        </div>
                        <h1 className="text-3xl font-bold">Waiting for other players...</h1>
                        <p className="text-neutral-400">You have completed the challenge! The final results will be calculated once the battle ends.</p>
                    </div>

                    <Card className="bg-neutral-900/50 border-neutral-800 p-6">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            Live Leaderboard
                        </h3>
                        <div className="space-y-4">
                            {battle.participants
                                .sort((a, b) => b.score - a.score)
                                .map((participant, index) => (
                                    <div
                                        key={participant.id}
                                        className={`flex items-center justify-between p-4 rounded-lg border ${participant.userId === currentUser?.id
                                            ? "bg-emerald-500/10 border-emerald-500/50"
                                            : "bg-neutral-800/30 border-neutral-800"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="font-mono text-lg text-neutral-500 w-8">#{index + 1}</div>
                                            <Avatar className="w-10 h-10 border-2 border-neutral-700">
                                                <AvatarImage src={participant.user.avatar} />
                                                <AvatarFallback>{participant.user.username[0].toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-white">
                                                    {participant.user.username}
                                                    {participant.userId === currentUser?.id && " (You)"}
                                                </div>
                                                {participant.hasCompleted && (
                                                    <span className="text-xs text-emerald-500 font-medium">Completed</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-xl font-bold text-emerald-500">{participant.score} pts</div>
                                    </div>
                                ))}
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    const participants = battle.participants || [];
    const myResult = participants.find((p) => p.userId === currentUser?.id);
    const winner = participants.find((p) => p.rank === 1);
    const isWinner = myResult?.rank === 1;

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black pointer-events-none" />

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="z-10 w-full max-w-4xl space-y-8"
            >
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="inline-block p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4"
                    >
                        <Trophy className="w-16 h-16 text-emerald-400" />
                    </motion.div>

                    <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
                        {isWinner ? "Victory!" : "Battle Complete"}
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        {isWinner
                            ? "You dominated the arena!"
                            : `Winner: ${winner?.user?.username || "Unknown"}`}
                    </p>
                </div>

                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl p-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm text-zinc-500 px-4">
                            <span>Rank</span>
                            <span>Player</span>
                            <span>Score</span>
                            <span>Rating Change</span>
                        </div>

                        {participants.map((participant, index) => (
                            <motion.div
                                key={participant.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex items-center justify-between p-4 rounded-xl border ${participant.userId === currentUser?.id
                                    ? "bg-emerald-500/10 border-emerald-500/30"
                                    : "bg-zinc-800/30 border-zinc-700/30"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${index === 0 ? "bg-yellow-500/20 text-yellow-400" :
                                        index === 1 ? "bg-zinc-400/20 text-zinc-300" :
                                            index === 2 ? "bg-amber-700/20 text-amber-600" :
                                                "text-zinc-500"
                                        }`}>
                                        {index === 0 ? <Crown className="w-4 h-4" /> : `#${index + 1}`}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10 border border-zinc-700">
                                            <AvatarImage src={participant.user?.avatar} />
                                            <AvatarFallback>{participant.user?.username?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium text-white">
                                                {participant.user?.username}
                                                {participant.userId === currentUser?.id && " (You)"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-white">{participant.score}</div>
                                        <div className="text-xs text-zinc-500">points</div>
                                    </div>

                                    <div className={`flex items-center gap-1 font-bold min-w-[80px] justify-end ${participant.crownChange > 0 ? "text-emerald-400" :
                                        participant.crownChange < 0 ? "text-red-400" : "text-zinc-400"
                                        }`}>
                                        {participant.crownChange > 0 ? "+" : ""}{participant.crownChange}
                                        <Crown className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>

                <div className="flex justify-center gap-4 pt-8">
                    <Button
                        variant="outline"
                        className="border-zinc-700 hover:bg-zinc-800 text-white px-8 py-6 text-lg"
                        onClick={() => router.push("/")}
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Back to Home
                    </Button>
                    <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg"
                        onClick={() => router.push(battle.type === "DUALS" ? "/duelsmatchup" : "/havocmatchup")}
                    >
                        Play Again
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
