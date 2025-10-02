import ReactMarkdown from "react-markdown";
import { 
  Card  
} from '@/components/ui/card';
import { cn } from "@/lib/utils";

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
      <Card
        className={cn(
          "max-w-lg px-4 py-2 rounded-xl border-2 border-secondary",
          sender === "user"
            ? "bg-secondary/50"
            : ""
        )}
      > 
        {/* {text} */}
        <ReactMarkdown>{text}</ReactMarkdown>
      </Card>
    </div>
  );
}; 

