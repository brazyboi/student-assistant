import { useState, useEffect } from "react";
import ChatTab from "./ChatTab";
import AddChatButton from "./AddChatButton";
import type { Chat } from "../types";

interface SidebarProps {
    chats: Chat[];
    onSelectChat: (id: number) => void;
    selectedChatId: number | null;
    onAddChat: () => void;
}

export default function ChatSidebar({ chats, onSelectChat, selectedChatId, onAddChat } : SidebarProps) {
    const [sidebarWidth, setSidebarWidth] = useState(500);
    const [isDragging, setDragging] = useState(false);
    // const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

    const [startX, setStartX] = useState(0);
    const [startWidth, setStartWidth] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        setStartX(e.clientX);
        setStartWidth(sidebarWidth);
        e.preventDefault();
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        setSidebarWidth(Math.max(150, startWidth + deltaX));
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        setSidebarWidth(Math.max(150, startWidth + deltaX));
        };

        const handleMouseUp = () => setDragging(false);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, startX, startWidth]);

  return (
        <aside
            className="flex flex-col w-1/3 relative p-2"
            style={{ width: sidebarWidth }}
        >
            <h2 className="text-center text-5xl mt-5 py-5 mb-2">Chats</h2>
            <div className="flex-1">
                {chats.map((chat) => (
                    <ChatTab 
                        key={chat.id} 
                        title={chat.title}
                        selected={chat.id === selectedChatId}
                        onClick={() => onSelectChat(chat.id)}
                    />
                ))}

            </div>
            <AddChatButton onAdd={onAddChat} />

            <div
                className="absolute top-0 right-0 h-full w-0.5 cursor-ew-resize bg-gray-600"
                onMouseDown={handleMouseDown}
            />
           
        </aside>
  );
};