"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/app/api";
import {
    Trophy,
    Calendar,
    Medal,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function BattleHistoryPage() {
    const [battles, setBattles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetchUserAndBattles();
    }, [pagination.page]);

    const fetchUserAndBattles = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("No token found");
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };

            let userId = currentUser?.id;
            if (!userId) {
                try {
                    const profileRes = await api.get("/auth/profile", { headers });
                    console.log("Profile fetched:", profileRes.data);
                    userId = profileRes.data.data.id;
                    setCurrentUser(profileRes.data.data);
                } catch (err) {
                    console.error("Error fetching profile:", err);
                    return;
                }
            }

            console.log(`Fetching battles for user ${userId}`);

            const response = await api.get(`/battles/user/${userId}`, {
                headers,
                params: {
                    page: pagination.page,
                    limit: pagination.limit
                }
            });

            console.log("Battles response:", response.data);

            setBattles(response.data.data.battles);
            setPagination(prev => ({
                ...prev,
                ...response.data.data.pagination
            }));
        } catch (error) {
            console.error("Error fetching history:", error);
            toast.error("Failed to load battle history");
        } finally {
            setLoading(false);
        }
    };

    const getBattleTypeDisplay = (type) => {
        return type === 'DUALS' ? 'Duels' : type === 'HAVOC' ? 'Havoc' : type;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-neutral-800">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-emerald-500" />
                        Battle History
                    </h1>
                </div>

                <Card className="bg-neutral-900/50 border-neutral-800">
                    {loading ? (
                        <div className="p-12 flex flex-col items-center justify-center text-neutral-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
                            <p>Loading history...</p>
                        </div>
                    ) : battles.length === 0 ? (
                        <div className="p-12 text-center text-neutral-400">
                            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No battles found yet. Go compete!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-800">
                            {battles.map((participant) => (
                                <div key={participant.id} className="p-4 hover:bg-neutral-800/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${participant.rank === 1
                                            ? 'bg-emerald-500/10 border border-emerald-500/20'
                                            : 'bg-neutral-800'
                                            }`}>
                                            <span className="text-xl font-bold text-white">#{participant.rank}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-white">
                                                    {getBattleTypeDisplay(participant.battle.type)}
                                                </span>
                                                <span className="px-2 py-0.5 rounded text-xs bg-neutral-800 text-neutral-400 border border-neutral-700">
                                                    {participant.battle.mode}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-xs border ${participant.battle.status === 'COMPLETED'
                                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                    }`}>
                                                    {participant.battle.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-neutral-400 mt-1">
                                                {participant.battle.problem.title} • {participant.battle.problem.difficulty}
                                            </div>
                                            <div className="text-xs text-neutral-500 mt-1">
                                                {formatDate(participant.joinedAt)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-6 pl-16 sm:pl-0">
                                        <div className="text-right">
                                            <div className="text-xs text-neutral-400">Score</div>
                                            <div className="font-mono font-bold text-emerald-500">{participant.score}</div>
                                        </div>

                                        <div className="text-right min-w-[60px]">
                                            <div className="text-xs text-neutral-400">Crowns</div>
                                            <div className={`font-bold ${participant.crownChange > 0 ? 'text-emerald-500' :
                                                participant.crownChange < 0 ? 'text-red-500' : 'text-neutral-400'
                                                }`}>
                                                {participant.crownChange > 0 ? '+' : ''}{participant.crownChange}
                                            </div>
                                        </div>

                                        {participant.rank === 1 && (
                                            <Medal className="w-6 h-6 text-yellow-500 shrink-0" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && battles.length > 0 && (
                        <div className="p-4 border-t border-neutral-800 flex items-center justify-between">
                            <div className="text-sm text-neutral-400">
                                Page {pagination.page} of {pagination.totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.page === 1}
                                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                    className="border-neutral-700 hover:bg-neutral-800"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.page >= pagination.totalPages}
                                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                    className="border-neutral-700 hover:bg-neutral-800"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div >
        </div >
    );
}
