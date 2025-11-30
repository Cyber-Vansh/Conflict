"use client";

import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const openChat = (friend) => {
        setSelectedFriend(friend);
        setIsOpen(true);
    };

    const closeChat = () => {
        setIsOpen(false);
        setSelectedFriend(null);
    };

    return (
        <ChatContext.Provider value={{
            isOpen,
            setIsOpen,
            selectedFriend,
            setSelectedFriend,
            openChat,
            closeChat
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    return useContext(ChatContext);
}
