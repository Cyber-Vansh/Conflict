"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Users,
    UserPlus,
    Search,
    Check,
    X,
    MessageSquare,
    Loader2,
    Trash2
} from "lucide-react";
import api from "@/app/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useChat } from "@/context/ChatContext";

export default function FriendsPage() {
    const router = useRouter();
    const { openChat } = useChat();
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [friendsRes, requestsRes] = await Promise.all([
                api.get("/friends"),
                api.get("/friends/requests")
            ]);
            setFriends(friendsRes.data.data || []);
            setRequests(requestsRes.data.data || []);
        } catch (error) {
            console.error("Error fetching friends data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (requestId) => {
        try {
            await api.post("/friends/accept", { requestId });
            fetchData();
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await api.post("/friends/reject", { requestId });
            fetchData();
        } catch (error) {
            console.error("Error rejecting request:", error);
        }
    };

    const handleRemoveFriend = async (friendId) => {
        try {
            await api.post("/friends/remove", { friendId });
            toast.success("Friend removed");
            fetchData();
        } catch (error) {
            console.error("Error removing friend:", error);
            toast.error("Failed to remove friend");
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const res = await api.get(`/friends/search?q=${searchQuery}`);
            setSearchResults(res.data.data || []);
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setSearching(false);
        }
    };

    const handleAddFriend = async (userId) => {
        try {
            await api.post("/friends/request", { userId });
            toast.success("Friend request sent!");
            setSearchResults(prev => prev.map(user =>
                user.id === userId ? { ...user, requestSent: true } : user
            ));
            fetchData();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setSearchResults(prev => prev.map(user =>
                    user.id === userId ? { ...user, requestSent: true } : user
                ));
                toast.info("Friend request already sent");
            } else {
                console.error("Error sending friend request:", error);
                toast.error("Failed to send friend request");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Users className="w-8 h-8 text-emerald-500" />
                        Friends
                    </h1>
                </div>

                <Tabs defaultValue="friends" className="space-y-6">
                    <TabsList className="bg-neutral-900 border border-neutral-800">
                        <TabsTrigger value="friends" className="data-[state=active]:bg-emerald-600">
                            My Friends ({friends.length})
                        </TabsTrigger>
                        <TabsTrigger value="requests" className="data-[state=active]:bg-emerald-600">
                            Requests ({requests.length})
                        </TabsTrigger>
                        <TabsTrigger value="add" className="data-[state=active]:bg-emerald-600">
                            Add Friend
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="friends">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {friends.length === 0 ? (
                                <div className="col-span-full text-center py-12 text-neutral-500">
                                    You haven't added any friends yet.
                                </div>
                            ) : (
                                friends.map((friend) => (
                                    <Card key={friend.id} className="bg-neutral-900/50 border-neutral-800 p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={friend.avatar} />
                                                <AvatarFallback>{friend.username[0].toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-white">{friend.fullName}</div>
                                                <div className="text-sm text-neutral-400">@{friend.username}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="hover:bg-emerald-500/10 hover:text-emerald-500"
                                                onClick={() => openChat(friend)}
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="hover:bg-red-500/10 hover:text-red-500"
                                                onClick={() => handleRemoveFriend(friend.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="requests">
                        <div className="space-y-4">
                            {requests.length === 0 ? (
                                <div className="text-center py-12 text-neutral-500">
                                    No pending friend requests.
                                </div>
                            ) : (
                                requests.map((req) => (
                                    <Card key={req.id} className="bg-neutral-900/50 border-neutral-800 p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={req.requester.avatar} />
                                                <AvatarFallback>{req.requester.username[0].toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-white">{req.requester.fullName}</div>
                                                <div className="text-sm text-neutral-400">@{req.requester.username}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => handleAccept(req.id)} className="bg-emerald-600 hover:bg-emerald-500">
                                                <Check className="w-4 h-4 mr-1" /> Accept
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => handleReject(req.id)} className="border-neutral-700 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50">
                                                <X className="w-4 h-4 mr-1" /> Reject
                                            </Button>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="add">
                        <Card className="bg-neutral-900/50 border-neutral-800 p-6">
                            <form onSubmit={handleSearch} className="flex gap-4 mb-6">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                    <Input
                                        placeholder="Search by username..."
                                        className="pl-9 bg-neutral-950 border-neutral-800"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" disabled={searching}>
                                    {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
                                </Button>
                            </form>

                            <div className="text-center text-neutral-500 py-4 text-sm">
                                Search for users to add them as friends.
                            </div>

                            <div className="space-y-4 mt-4">
                                {searchResults.map((user) => (
                                    <Card key={user.id} className="bg-neutral-900/50 border-neutral-800 p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-white">{user.fullName}</div>
                                                <div className="text-sm text-neutral-400">@{user.username}</div>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleAddFriend(user.id)}
                                            disabled={user.requestSent || friends.some(f => f.id === user.id) || requests.some(r => r.requester.id === user.id)}
                                            className="bg-emerald-600 hover:bg-emerald-500"
                                        >
                                            {user.requestSent ? <Check className="w-4 h-4 mr-1" /> : <UserPlus className="w-4 h-4 mr-1" />}
                                            {user.requestSent ? "Sent" : "Add"}
                                        </Button>
                                    </Card>
                                ))}
                                {searchResults.length === 0 && searchQuery && !searching && (
                                    <div className="text-center text-neutral-500 py-8">
                                        No users found.
                                    </div>
                                )}
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
