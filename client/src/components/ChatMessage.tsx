type MessageProps = {
    text: string;
    sender: "user" | "ai";
};

export default function ChatMessage({text, sender} : MessageProps) {
    const isUser = sender === "user";

    return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} my-2 mx-2`}
    >
      <div
        className={`max-w-xs px-4 py-2 rounded-xl
          ${isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
      >
        {text}
      </div>
    </div>
  );
}; 

