import { useState } from "react";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";
import type { Message } from "./components/ChatWindow";
import { sendMessage } from "./api/chat";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  async function handleSend(userText: string) {
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);

    const reply = await sendMessage(userText);
    setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
  }

  return (
    <div className="flex flex-col h-full w-full">
      <ChatWindow messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
}