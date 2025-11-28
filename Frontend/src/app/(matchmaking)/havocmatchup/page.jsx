"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/app/api";
import {
  Users,
  Clock,
  Zap,
  Crown,
  Target,
  ArrowLeft,
  Loader2,
  Dice3,
  UserPlus,
  Flame
} from "lucide-react";

export default function HavocMatchupPage() {
  const router = useRouter();
  const [mode, setMode] = useState("select");
  const [battleType, setBattleType] = useState(null);
  const [currentBattle, setCurrentBattle] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(null);


  const [roomId, setRoomId] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [duration, setDuration] = useState(900); // 15 min default
  const [maxPlayers, setMaxPlayers] = useState(10);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  useEffect(() => {
    if (mode === "lobby" && currentBattle) {
      const interval = setInterval(() => {
        pollBattleStatus();
      }, 2000);
      setPollingInterval(interval);
      return () => clearInterval(interval);
    }
  }, [mode, currentBattle]);

  const pollBattleStatus = async () => {
    if (!currentBattle) return;
    try {
      const response = await api.get(`/battles/${currentBattle.id}`);
      const updatedBattle = response.data.data;
      setCurrentBattle(updatedBattle);
      if (updatedBattle.status === "ACTIVE") {
        router.push(`/compiler?battleId=${updatedBattle.id}`);
      }
    } catch (error) {
      console.error("Error polling battle:", error);
    }
  };

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await api.get("/problems?isPublic=true&limit=50");
      const problemsData = Array.isArray(response.data.data) ? response.data.data : [];
      setProblems(problemsData);
      if (problemsData.length > 0) {
        setSelectedProblem(problemsData[0].id);
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const findRankedMatch = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.get("/battles?type=HAVOC&status=WAITING&mode=RANKED");
      const availableBattles = response.data.data || [];

      if (availableBattles.length > 0) {
        const battle = availableBattles[0];
        await api.post(
          `/battles/${battle.id}/join`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const battleResponse = await api.get(`/battles/${battle.id}`);
        setCurrentBattle(battleResponse.data.data);
        setMode("lobby");
      } else {
        const problemsResponse = await api.get("/problems?isPublic=true&limit=50");
        const problemsData = problemsResponse.data.data || [];
        if (problemsData.length === 0) {
          alert("No problems available");
          setLoading(false);
          return;
        }

        const randomProblem = problemsData[Math.floor(Math.random() * problemsData.length)];

        const createResponse = await api.post(
          "/battles",
          {
            type: "HAVOC",
            mode: "RANKED",
            problemId: randomProblem.id,
            duration: 900,
            maxPlayers: 10,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCurrentBattle(createResponse.data.data);
        setMode("lobby");
      }
    } catch (error) {
      console.error("Error finding match:", error);
      alert(error.response?.data?.message || "Failed to find match");
    } finally {
      setLoading(false);
    }
  };

  const createFriendlyRoom = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/battles",
        {
          type: "HAVOC",
          mode: "FRIEND",
          problemId: selectedProblem,
          duration: duration,
          maxPlayers: maxPlayers,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentBattle(response.data.data);
      setMode("lobby");
    } catch (error) {
      console.error("Error creating room:", error);
      alert(error.response?.data?.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const joinFriendlyRoom = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const battleResponse = await api.get(`/battles/${roomId}`);
      const battle = battleResponse.data.data;

      if (battle.mode !== "FRIEND") {
        alert("This is not a friendly match room");
        setLoading(false);
        return;
      }

      if (battle.status !== "WAITING") {
        alert("This battle has already started or ended");
        setLoading(false);
        return;
      }

      await api.post(
        `/battles/${roomId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentBattle(battle);
      setMode("lobby");
    } catch (error) {
      console.error("Error joining room:", error);
      alert(error.response?.data?.message || "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  const startBattle = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await api.post(
        `/battles/${currentBattle.id}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error starting battle:", error);
      alert(error.response?.data?.message || "Failed to start battle");
      setLoading(false);
    }
  };

  const leaveBattle = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/battles/${currentBattle.id}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentBattle(null);
      setMode("select");
    } catch (error) {
      console.error("Error leaving battle:", error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY": return "text-emerald-500";
      case "MEDIUM": return "text-yellow-500";
      case "HARD": return "text-red-500";
      default: return "text-neutral-400";
    }
  };


  if (mode === "select") {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-neutral-400 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-8 h-8 text-emerald-500" strokeWidth={2.5} />
              <h1 className="text-4xl font-bold text-white">Havoc</h1>
            </div>
            <p className="text-neutral-400">Free-for-all multiplayer battles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-neutral-900/50 border-neutral-800 p-8">
              <div className="mb-6">
                <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 inline-block mb-4">
                  <Crown className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-white">Ranked Match</h2>
                <p className="text-neutral-400 mb-4">
                  Compete against multiple opponents for crown rewards and glory.
                </p>

                <div className="space-y-2 text-sm text-neutral-500 mb-6">
                  <div className="flex items-center gap-2">
                    <Dice3 className="w-4 h-4" />
                    <span>Random problem & opponents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Instant matchmaking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    <span>Up to 10 players</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => { setBattleType("RANKED"); findRankedMatch(); }}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Finding Match...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Find Ranked Match
                  </>
                )}
              </Button>
            </Card>

            <Card className="bg-neutral-900/50 border-neutral-800 p-8">
              <div className="mb-6">
                <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 inline-block mb-4">
                  <Users className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-white">Friendly Match</h2>
                <p className="text-neutral-400 mb-4">
                  Create a private room or join friends. Choose your settings and participants.
                </p>

                <div className="space-y-2 text-sm text-neutral-500 mb-6">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>Custom problem & duration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Invite with Room ID</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>2-10 players</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => { setBattleType("FRIEND"); setMode("friendly-create"); fetchProblems(); }}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Create Room
                </Button>
                <Button
                  onClick={() => { setBattleType("FRIEND"); setMode("friendly-join"); }}
                  variant="outline"
                  className="w-full border-neutral-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Room
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }


  if (mode === "friendly-create") {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button
            variant="ghost"
            onClick={() => setMode("select")}
            className="text-neutral-400 hover:text-white mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl font-bold mb-6 text-white">Create Havoc Room</h1>

          <Card className="bg-neutral-900/50 border-neutral-800 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">
                Select Problem
              </label>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                </div>
              ) : problems.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  No problems available
                </div>
              ) : (
                <select
                  value={selectedProblem || ""}
                  onChange={(e) => setSelectedProblem(Number(e.target.value))}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white"
                >
                  {problems.map((problem) => (
                    <option key={problem.id} value={problem.id}>
                      {problem.title} ({problem.difficulty})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">
                Duration (minutes)
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[10, 15, 20, 30].map((min) => (
                  <button
                    key={min}
                    onClick={() => setDuration(min * 60)}
                    className={`p-3 rounded-lg border transition ${duration === min * 60
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600"
                      }`}
                  >
                    {min} min
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">
                Max Players
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[2, 4, 6, 8, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setMaxPlayers(num)}
                    className={`p-3 rounded-lg border transition ${maxPlayers === num
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600"
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={createFriendlyRoom}
              disabled={!selectedProblem || loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Room...
                </>
              ) : (
                "Create Room"
              )}
            </Button>
          </Card>
        </div>
      </div>
    );
  }


  if (mode === "friendly-join") {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button
            variant="ghost"
            onClick={() => setMode("select")}
            className="text-neutral-400 hover:text-white mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl font-bold mb-6 text-white">Join Havoc Room</h1>

          <Card className="bg-neutral-900/50 border-neutral-800 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">
                Enter Room ID
              </label>
              <Input
                type="number"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="e.g., 123"
                className="w-full bg-neutral-800 border border-neutral-700 text-white text-lg px-4 py-3"
              />
              <p className="text-sm text-neutral-500 mt-2">
                Get the Room ID from the room creator
              </p>
            </div>

            <Button
              onClick={joinFriendlyRoom}
              disabled={!roomId || loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Room
                </>
              )}
            </Button>
          </Card>
        </div>
      </div>
    );
  }


  if (mode === "lobby" && currentBattle) {
    const participants = currentBattle.participants || [];
    const maxPlayers = currentBattle.maxPlayers || 10;
    const canStart = participants.length >= 2;
    const emptySlots = Array(maxPlayers - participants.length).fill(null);
    const userId = participants.find((p) => p.user)?.user?.id;
    const isFriendly = currentBattle.mode === "FRIEND";

    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-4">
              {isFriendly && (
                <>
                  <span>Room ID: {currentBattle.id}</span>
                  <span className="text-neutral-500">•</span>
                </>
              )}
              <span>{currentBattle.mode}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {currentBattle.problem?.title || "Battle Lobby"}
            </h1>
            <div className="flex items-center gap-4 text-neutral-400">
              <span className={getDifficultyColor(currentBattle.problem?.difficulty)}>
                {currentBattle.problem?.difficulty}
              </span>
              <span>•</span>
              <span>{Math.floor(currentBattle.duration / 60)} minutes</span>
            </div>
          </div>

          {isFriendly && (
            <Card className="bg-emerald-500/10 border-emerald-500/30 p-4 mb-6">
              <div className="flex items-start gap-3">
                <UserPlus className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-400 mb-1">
                    Share Room ID with friends
                  </p>
                  <p className="text-xs text-neutral-400">
                    They can join by entering Room ID: <span className="font-mono text-white">{currentBattle.id}</span>
                  </p>
                </div>
              </div>
            </Card>
          )}

          <Card className="bg-neutral-900/50 border-neutral-800 p-6 mb-6">
            <h2 className="text-lg font-bold mb-4 text-white">
              Participants ({participants.length}/{maxPlayers})
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border-2 bg-emerald-500/10 border-emerald-500/30"
                >
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="w-12 h-12 border-2 border-neutral-700 mb-2">
                      <AvatarImage src={participant.user?.avatar} />
                      <AvatarFallback className="bg-neutral-800 text-white">
                        {participant.user?.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium text-white truncate w-full">
                      {participant.user?.username}
                    </div>
                    {participant.userId === userId && (
                      <span className="text-xs text-emerald-500">You</span>
                    )}
                  </div>
                </div>
              ))}

              {emptySlots.map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="p-4 rounded-lg border-2 border-dashed bg-neutral-800/50 border-neutral-700"
                >
                  <div className="flex flex-col items-center text-center py-2">
                    <Users className="w-8 h-8 text-neutral-600 mb-2" />
                    <div className="text-xs text-neutral-500">Waiting</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <Button
              onClick={leaveBattle}
              variant="outline"
              className="border-neutral-700 hover:border-red-500/50 hover:bg-red-500/10 text-neutral-300 hover:text-red-400"
            >
              Leave Battle
            </Button>

            <Button
              onClick={startBattle}
              disabled={!canStart || loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : !canStart ? (
                "Need 2+ players"
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Start Battle
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
