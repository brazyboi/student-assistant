import { useEffect, useRef } from 'react';
import ChatMessage from "./ChatMessage";
import StickyProblem from '@/components/StickyProblem';
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

  const [firstMessage, ...restMessages] = messages;

  return (
    <div className="flex flex-col h-full min-h-0">
      <StickyProblem problem={firstMessage.text} />
      <div className="flex-1 min-h-0 overflow-y-auto py-4 scroll-hide">
        {restMessages.map((msg, idx) => (
          <ChatMessage key={idx} sender={msg.sender} text={msg.text} />
        ))}
        {loading && (
          <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-lg w-fit mb-2">
            <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse" />
            <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.2s]" />
            <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.4s]" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}