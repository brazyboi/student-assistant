import { useEffect, useRef } from 'react';
import ChatMessage from "./ChatMessage";
import type { Message } from "../lib/types";

type ChatWindowProps = {
  messages: Message[];
  loading: boolean;
};


export default function ChatWindow({ messages, loading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto py-4 scroll-hover">
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} sender={msg.sender} text={msg.text} />
      ))}

      {loading && (
        <div className="flex items-center space-x-1 bg-gray-200 text-black px-3 py-2 rounded-lg w-fit mb-2">
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
        </div>
      )}

      <div ref={bottomRef}/>
    </div>
  );
}