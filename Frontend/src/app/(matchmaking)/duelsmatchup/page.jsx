"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/app/api";
import {
  Swords,
  Users,
  Clock,
  Zap,
  Crown,
  Target,
  ArrowLeft,
  Loader2,
  Dice3,
  UserPlus,
  LogOut
} from "lucide-react";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function DuelsMatchupPage() {
  const router = useRouter();
  const [mode, setMode] = useState("select");
  const [battleType, setBattleType] = useState(null);
  const [currentBattle, setCurrentBattle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  const isRedirecting = React.useRef(false);
  const isStarting = React.useRef(false);
  const isLeaving = React.useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id);
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    } else {
      api.get("/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          if (res.data.success) {
            const user = res.data.data;
            localStorage.setItem("user", JSON.stringify(user));
            setCurrentUserId(user.id);
          }
        })
        .catch(err => console.error(err));
    }
  }, [router]);

  const startBattle = async () => {
    if (isStarting.current || isRedirecting.current) return;
    isStarting.current = true;

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
      const errorMsg = error.response?.data?.message || "";

      console.log("Start battle error message:", errorMsg);

      if (errorMsg.includes("Battle already started") || errorMsg.includes("completed")) {
        if (!isRedirecting.current) {
          isRedirecting.current = true;
          console.log("Redirecting to battle:", currentBattle.id);
          router.push(`/compiler?battleId=${currentBattle.id}`);
        }
      } else {
        toast.error(errorMsg || "Failed to start battle");
        isStarting.current = false;
      }
      setLoading(false);
    }
  };

  const pollBattleStatus = async () => {
    if (!currentBattle || isRedirecting.current || isLeaving.current) return;
    try {
      const response = await api.get(`/battles/${currentBattle.id}`);
      const updatedBattle = response.data.data;

      const userStr = localStorage.getItem("user");
      const userId = userStr ? JSON.parse(userStr)?.id : null;
      const isParticipant = !userId || updatedBattle.participants?.some(p => p.userId === userId || p.user?.id === userId);

      if (!isParticipant) {
        console.log("User ID:", userId, "Participants:", updatedBattle.participants);
        toast.error("You are not a participant in this battle");
        setMode("select");
        setCurrentBattle(null);
        return;
      }

      setCurrentBattle(updatedBattle);

      if (updatedBattle.status === "ACTIVE") {
        if (!isRedirecting.current) {
          isRedirecting.current = true;
          router.push(`/compiler?battleId=${updatedBattle.id}`);
        }
      } else if (updatedBattle.status === "WAITING" && updatedBattle.type === "DUALS" && updatedBattle.participants?.length >= 2) {
        await startBattle();
      }
    } catch (error) {
      console.error("Error polling battle:", error);
    }
  };

  useEffect(() => {
    if (mode === "lobby" && currentBattle) {
      const socket = getSocket();
      socket.emit("join_battle", currentBattle.id);

      pollBattleStatus();

      socket.on("battle:update", (data) => {
        console.log("Battle update:", data);
        if (data.type === "player_joined" || data.type === "player_left") {
          pollBattleStatus();
        } else if (data.type === "started") {
          if (!isRedirecting.current) {
            isRedirecting.current = true;
            router.push(`/compiler?battleId=${data.battleId}`);
          }
        }
      });

      return () => {
        socket.emit("leave_battle", currentBattle.id);
        socket.off("battle:update");
      };
    }
  }, [mode, currentBattle]);






  const findRankedMatch = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.get("/battles?type=DUALS&status=WAITING&mode=RANKED");
      const availableBattles = response.data.data || [];

      const availableBattle = availableBattles.find(
        battle => (battle.participants?.length || 0) < (battle.maxPlayers || 2)
      );

      if (availableBattle) {
        const isAlreadyParticipant = availableBattle.participants?.some(p => p.userId === currentUserId);

        if (!isAlreadyParticipant) {
          await api.post(
            `/battles/${availableBattle.id}/join`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        const updatedBattleResponse = await api.get(`/battles/${availableBattle.id}`);
        setCurrentBattle(updatedBattleResponse.data.data);
        setMode("lobby");
      } else {
        // Create a new ranked battle - backend handles problem selection and duration
        const createResponse = await api.post(
          "/battles",
          {
            type: "DUALS",
            mode: "RANKED",
            maxPlayers: 2,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCurrentBattle(createResponse.data.data);
        setMode("lobby");
      }
    } catch (error) {
      console.error("Error finding match:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to find match";
      toast.error(errorMsg);
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
          type: "DUALS",
          mode: "FRIEND",
          maxPlayers: 2,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentBattle(response.data.data);
      setMode("lobby");
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error(error.response?.data?.message || "Failed to create room");
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
        toast.error("This is not a friendly match room");
        setLoading(false);
        return;
      }

      if (battle.status !== "WAITING") {
        toast.error("This battle has already started or ended");
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
      toast.error(error.response?.data?.message || "Failed to join room. Please check the Room ID.");
    } finally {
      setLoading(false);
    }
  };



  const leaveBattle = async () => {
    if (isLeaving.current) return;
    isLeaving.current = true;
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
    } finally {
      isLeaving.current = false;
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
              <Swords className="w-8 h-8 text-emerald-500" strokeWidth={2.5} />
              <h1 className="text-4xl font-bold text-white">Duels</h1>
            </div>
            <p className="text-neutral-400">Choose your battle mode</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <Card className="bg-neutral-900/50 border-neutral-800 p-8">
              <div className="mb-6">
                <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 inline-block mb-4">
                  <Crown className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-white">Ranked Match</h2>
                <p className="text-neutral-400 mb-4">
                  Compete for crowns. Get matched automatically with opponents of similar skill.
                </p>

                <div className="space-y-2 text-sm text-neutral-500 mb-6">
                  <div className="flex items-center gap-2">
                    <Dice3 className="w-4 h-4" />
                    <span>Random problem selection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Instant matchmaking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    <span>Earn/lose crowns</span>
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
                  Create a private room or join a friend's room. No crown changes.
                </p>

                <div className="space-y-2 text-sm text-neutral-500 mb-6">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>Choose your problem</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Invite friends with Room ID</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Practice without pressure</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => { setBattleType("FRIEND"); createFriendlyRoom(); }}
                  disabled={loading}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                >
                  {loading && battleType === "FRIEND" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Create Room
                    </>
                  )}
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

          <h1 className="text-3xl font-bold mb-6 text-white">Join Friendly Room</h1>

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
                Get the Room ID from your friend who created the room
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
    const canStart = participants.length >= 2;
    const userId = participants.find((p) => p.user)?.user?.id;
    const isFriendly = currentBattle.mode === "FRIEND";

    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                    Share Room ID with your friend
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
              Participants ({participants.length}/2)
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {[0, 1].map((index) => {
                const participant = participants[index];
                return (
                  <div
                    key={index}
                    className={`p-6 rounded-lg border-2 transition ${participant
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-neutral-800/50 border-neutral-700 border-dashed"
                      }`}
                  >
                    {participant ? (
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 border-2 border-neutral-700">
                          <AvatarImage src={participant.user?.avatar} />
                          <AvatarFallback className="bg-neutral-800 text-white">
                            {participant.user?.username?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-white">
                            {participant.user?.username}
                            {participant.userId === userId && (
                              <span className="text-xs text-emerald-500 ml-2">(You)</span>
                            )}
                          </div>
                          <div className="text-sm text-neutral-400">Ready</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Users className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                        <div className="text-sm text-neutral-500">Waiting...</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <Button
              onClick={leaveBattle}
              variant="outline"
              className="border-neutral-700 hover:border-red-500/50 hover:bg-red-500/10 text-neutral-300 hover:text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Leave Lobby
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
