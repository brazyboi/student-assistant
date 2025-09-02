import { useState, useEffect } from "react";

// Components
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";
import PromptSuggestions from "./components/PromptSuggestions";
import ChatSidebar from "./components/ChatSidebar";

// Backend
import { sendMessage } from "./api/chat";

// Types
import type { Message } from "./components/ChatWindow";
import type { Chat } from "./types";

export default function App() {
  const prompts = [
    "Create a study plan for me",
    "Summarize this text",
    "Explain this concept simply",
  ];

  const chats: Chat[] = [
    { id: 1, title: "HIIIII" },
    { id: 2, title: "yessir" },
  ];

  const [messages, setMessages] = useState<Message[]>([]);

  async function handleSend(userText: string) {
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);

    const reply = await sendMessage(userText);
    setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
  }

  return (
    <div className="flex h-screen">
      <ChatSidebar chats={chats} onSelectChat={() => {}} />
      <main className="flex flex-col h-full w-full">
        <ChatWindow messages={messages} />
        <PromptSuggestions prompts={prompts} onSelect={handleSend} />
        <ChatInput onSend={handleSend} />
      </main>
    </div>
  );
}