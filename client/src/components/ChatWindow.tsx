import { useEffect, useRef } from 'react';
import ChatMessage from "./ChatMessage";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export default function ChatWindow({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto py-4 scroll-hover">
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} sender={msg.sender} text={msg.text} />
      ))}
      <div ref={bottomRef}/>
    </div>
  );
}

export type { Message };