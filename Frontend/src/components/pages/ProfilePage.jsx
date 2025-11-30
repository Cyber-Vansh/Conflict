"use client"

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/app/api";
import {
  Trophy,
  Flame,
  Crown,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Medal,
  Star,
  Edit,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    avatar: ""
  });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (userData) {
      setEditForm({
        fullName: userData.fullName || "",
        username: userData.username || "",
        email: userData.email || "",
        bio: userData.bio || "",
        avatar: userData.avatar || ""
      });
    }
  }, [userData]);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      const [profileRes, statsRes] = await Promise.all([
        api.get("/auth/profile", { headers }),
        api.get("/auth/stats", { headers }),
      ]);

      setUserData(profileRes.data.data);
      setStats(statsRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setEditLoading(true);
    setEditError("");
    try {
      const token = localStorage.getItem("token");
      const response = await api.put("/auth/profile", editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserData(response.data.data);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      const msg = error.response?.data?.message || "Failed to update profile";
      setEditError(msg);
      toast.error(msg);
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
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
    <div className="min-h-screen bg-neutral-950 text-white">

      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-neutral-950 to-neutral-950 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="mb-10">
          <Card className="bg-neutral-900/50 border-neutral-800 p-8">
            <div className="flex flex-col md:flex-row items-start gap-8">

              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-neutral-800">
                  <AvatarImage src={userData?.avatar} />
                  <AvatarFallback className="bg-neutral-800 text-white text-4xl">
                    {userData?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute -bottom-2 -right-2 p-2 bg-emerald-600 rounded-full cursor-pointer hover:bg-emerald-500 transition"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 text-white" />
                </div>
              </div>


              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-1 text-white">{userData?.fullName || "User"}</h1>
                    <p className="text-neutral-300">@{userData?.username}</p>
                  </div>

                  <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="mt-4 md:mt-0 border-neutral-700 hover:border-emerald-500/50 bg-white text-neutral-900 hover:!text-white hover:bg-emerald-500/10">
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-neutral-900 border-neutral-800 text-white sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription className="text-neutral-400">
                          Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>

                      {editError && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">
                          {editError}
                        </div>
                      )}

                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            value={editForm.fullName}
                            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                            className="bg-neutral-800 border-neutral-700 focus:border-emerald-500"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={editForm.username}
                            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                            className="bg-neutral-800 border-neutral-700 focus:border-emerald-500"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="bg-neutral-800 border-neutral-700 focus:border-emerald-500"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={editForm.bio}
                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                            className="bg-neutral-800 border-neutral-700 focus:border-emerald-500 resize-none"
                            rows={3}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="avatar">Avatar URL</Label>
                          <Input
                            id="avatar"
                            value={editForm.avatar}
                            onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                            className="bg-neutral-800 border-neutral-700 focus:border-emerald-500"
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsEditing(false)} className="hover:bg-neutral-800 text-neutral-400">
                          Cancel
                        </Button>
                        <Button onClick={handleUpdateProfile} disabled={editLoading} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                          {editLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {userData?.bio && (
                  <p className="text-neutral-300 mb-6 max-w-2xl">{userData.bio}</p>
                )}


                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs text-neutral-400 font-medium">Battles</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{userData?.totalBattles || 0}</div>
                  </div>

                  <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs text-neutral-400 font-medium">Win Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-500">{winRate}%</div>
                  </div>

                  <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs text-neutral-400 font-medium">Wins</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{userData?.wins || 0}</div>
                  </div>

                  <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs text-neutral-400 font-medium">Crowns</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {(userData?.dualsCrowns || 0) + (userData?.havocCrowns || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

          <Card className="bg-neutral-900/50 border-neutral-800 p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <Crown className="w-5 h-5 text-yellow-500" />
              Crown Rankings
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-white">Duels</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-500">
                    {userData?.dualsCrowns || 0}
                  </span>
                </div>
                <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all"
                    style={{ width: `${Math.min((userData?.dualsCrowns || 0) / 20, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium text-white">Havoc</span>
                  </div>
                  <span className="text-lg font-bold text-blue-500">
                    {userData?.havocCrowns || 0}
                  </span>
                </div>
                <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all"
                    style={{ width: `${Math.min((userData?.havocCrowns || 0) / 20, 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Total Crowns</span>
                  <span className="text-xl font-bold text-yellow-500">
                    {(userData?.dualsCrowns || 0) + (userData?.havocCrowns || 0)}
                  </span>
                </div>
              </div>
            </div>
          </Card>


          <Card className="bg-neutral-900/50 border-neutral-800 p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <Medal className="w-5 h-5 text-emerald-500" />
              Battle Records
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Victories</div>
                    <div className="text-xs text-neutral-400">Successful battles</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-emerald-500">{userData?.wins || 0}</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Defeats</div>
                    <div className="text-xs text-neutral-400">Learning experiences</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-500">{userData?.losses || 0}</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Win Rate</div>
                    <div className="text-xs text-neutral-400">Success percentage</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-500">{winRate}%</div>
              </div>
            </div>
          </Card>


          <Card className="bg-neutral-900/50 border-neutral-800 p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <Star className="w-5 h-5 text-yellow-500" />
              Achievements
            </h3>

            <div className="space-y-3">
              {userData?.totalBattles >= 10 && (
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-lg border border-yellow-500/20">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Warrior</div>
                    <div className="text-xs text-neutral-400">Completed 10 battles</div>
                  </div>
                </div>
              )}

              {userData?.wins >= 5 && (
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-lg border border-emerald-500/20">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Victor</div>
                    <div className="text-xs text-neutral-400">Won 5 battles</div>
                  </div>
                </div>
              )}

              {winRate >= 60 && userData?.totalBattles >= 5 && (
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/10 to-transparent rounded-lg border border-blue-500/20">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Champion</div>
                    <div className="text-xs text-neutral-400">60%+ win rate</div>
                  </div>
                </div>
              )}

              {(!userData?.totalBattles || userData.totalBattles < 10) && (
                <div className="text-center py-8 text-neutral-400 text-sm">
                  Complete more battles to unlock achievements!
                </div>
              )}
            </div>
          </Card>
        </div>


        {stats?.recentBattles && stats.recentBattles.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <Calendar className="w-5 h-5 text-emerald-500" />
                Recent Activity
              </h3>
              <Button
                variant="ghost"
                className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                onClick={() => window.location.href = '/profile/history'}
              >
                View All History
              </Button>
            </div>

            <Card className="bg-neutral-900/50 border-neutral-800">
              <div className="divide-y divide-neutral-800">
                {stats.recentBattles.map((battle, idx) => (
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
                ))}
              </div>
            </Card>
          </div>
        )}


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
    </div>
  );
}
