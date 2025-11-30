"use client";

import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, X, Loader2 } from "lucide-react";
import api from "@/app/api";
import { getSocket } from "@/lib/socket";
import { useChat } from "@/context/ChatContext";

export default function ChatDrawer() {
    const { isOpen, setIsOpen, selectedFriend, setSelectedFriend } = useChat();
    const [friends, setFriends] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);
    const scrollRef = useRef(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchFriends();
            fetchCurrentUser();
            const s = getSocket();
            setSocket(s);

            if (s) {
            }
        }
    }, [isOpen]);

    useEffect(() => {
        if (currentUser && socket) {
            socket.emit("join_chat", currentUser.id);

            socket.on("receive_message", (message) => {
                if (selectedFriend && message.senderId === selectedFriend.id) {
                    setMessages((prev) => [...prev, message]);
                    scrollToBottom();
                }
            });

            socket.on("message_sent", (message) => {
                if (selectedFriend && message.receiverId === selectedFriend.id) {
                    setMessages((prev) => [...prev, message]);
                    scrollToBottom();
                }
            });

            return () => {
                socket.off("receive_message");
                socket.off("message_sent");
            };
        }
    }, [currentUser, socket, selectedFriend]);

    useEffect(() => {
        if (selectedFriend) {
            fetchMessages(selectedFriend.id);
        }
    }, [selectedFriend]);

    const fetchCurrentUser = async () => {
        try {
            const res = await api.get("/auth/profile");
            setCurrentUser(res.data.data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const fetchFriends = async () => {
        try {
            const res = await api.get("/friends");
            setFriends(res.data.data || []);
        } catch (error) {
            console.error("Error fetching friends:", error);
        }
    };

    const fetchMessages = async (friendId) => {
        setLoading(true);
        try {
            const res = await api.get(`/chat/${friendId}`);
            setMessages(res.data.data || []);
            scrollToBottom();
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedFriend || !socket) return;

        const messageData = {
            senderId: currentUser.id,
            receiverId: selectedFriend.id,
            content: newMessage
        };

        socket.emit("private_message", messageData);
        setNewMessage("");
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-emerald-600 hover:bg-emerald-500 shadow-lg z-50"
                >
                    <MessageSquare className="w-6 h-6 text-white" />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] bg-neutral-950 border-l border-neutral-800 p-0 flex flex-col">
                <SheetHeader className="p-6 border-b border-neutral-800">
                    <SheetTitle className="text-white flex items-center gap-2">
                        {selectedFriend ? (
                            <>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedFriend(null)} className="-ml-2 mr-1">
                                    <X className="w-4 h-4" />
                                </Button>
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={selectedFriend.avatar} />
                                    <AvatarFallback>{selectedFriend.username[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span>{selectedFriend.fullName}</span>
                            </>
                        ) : (
                            "Messages"
                        )}
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-hidden flex flex-col">
                    {!selectedFriend ? (
                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-2">
                                {friends.length === 0 ? (
                                    <div className="text-center text-neutral-500 py-8">
                                        No friends yet. Add some friends to start chatting!
                                    </div>
                                ) : (
                                    friends.map((friend) => (
                                        <div
                                            key={friend.id}
                                            onClick={() => setSelectedFriend(friend)}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-900 cursor-pointer transition"
                                        >
                                            <Avatar>
                                                <AvatarImage src={friend.avatar} />
                                                <AvatarFallback>{friend.username[0].toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-white">{friend.fullName}</div>
                                                <div className="text-sm text-neutral-400">@{friend.username}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    ) : (
                        <>
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {loading ? (
                                        <div className="flex justify-center py-4">
                                            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                                        </div>
                                    ) : (
                                        messages.map((msg, idx) => {
                                            const isMe = msg.senderId === currentUser?.id;
                                            return (
                                                <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                                    <div className={`max-w-[80%] rounded-lg p-3 ${isMe
                                                        ? "bg-emerald-600 text-white"
                                                        : "bg-neutral-800 text-neutral-200"
                                                        }`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>
                            <div className="p-4 border-t border-neutral-800 bg-neutral-900/50">
                                <form onSubmit={sendMessage} className="flex gap-2">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="bg-neutral-950 border-neutral-800 focus:border-emerald-500"
                                    />
                                    <Button type="submit" size="icon" className="bg-emerald-600 hover:bg-emerald-500">
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
