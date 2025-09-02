import { useState, useEffect, useRef } from "react";
import ChatTab from "./ChatTab";
import type { Chat } from "../types";


interface SidebarProps {
  chats: Chat[];
  onSelectChat: (id: number) => void;
}

export default function ChatSidebar({ chats, onSelectChat } : SidebarProps) {
    const [sidebarWidth, setSidebarWidth] = useState(250);
    const [isDragging, setDragging] = useState(false);
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

    // For dragging the sidebar
    // const mouseStartX = useRef(0);
    // const sidebarStartWidth = useRef(0);

    // const handleMouseDown = (e: React.MouseEvent) => {
    //     setDragging(true);
    //     mouseStartX.current = e.clientX;
    //     sidebarStartWidth.current = sidebarWidth;
    //     e.preventDefault();
    // };

    // const handleMouseMove = (e: React.MouseEvent) => {
    //     if (!isDragging) return;
    //     const deltaX = e.clientX - mouseStartX.current;
    //     setSidebarWidth(Math.max(150, sidebarStartWidth.current + deltaX));
    // };

    // const handleMouseUp = () => {
    //     setDragging(false);
    // };

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
            className="flex flex-col border-r w-1/4 relative"
            // onMouseMove={handleMouseMove}
            // onMouseUp={handleMouseUp}
            // onMouseLeave={handleMouseUp}
            style={{ width: sidebarWidth }}
        >
            <h2 className="text-center text-4xl font-bold mb-2">Chats</h2>
            <div className="flex-1">
                {chats.map((chat) => (
                    <ChatTab 
                        key={chat.id} 
                        title={chat.title}
                        selected={chat.id === selectedChatId}
                        onClick={() => setSelectedChatId(chat.id)}
                    />
                ))}
            </div>

            <div
                className="absolute top-0 right-0 h-full w-5 cursor-ew-resize bg-gray-400"
                onMouseDown={handleMouseDown}
            />
           
        </aside>
  );
};