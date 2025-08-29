import ChatMessage from "./ChatMessage";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export default function ChatWindow({ messages }: { messages: Message[] }) {
  return (
    <div>
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} sender={msg.sender} text={msg.text} />
      ))}
    </div>
  );
}

export type { Message };