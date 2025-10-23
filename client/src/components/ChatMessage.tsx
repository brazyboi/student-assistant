import { 
  Card  
} from '@/components/ui/card';
import { cn } from "@/lib/utils";
import MarkdownRenderer from "@/lib/Markdown";


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
            "max-w-[75%] w-fit px-4 py-2 rounded-xl border-2 border-secondary break-words break-all whitespace-pre-wrap overflow-hidden",
            sender === "user"
              ? "bg-secondary/50"
              : ""
          )}
        > 
          <MarkdownRenderer markdown={text} />
        </Card>
      </div>
  );
}; 

