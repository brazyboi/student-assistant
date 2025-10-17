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
    // const formatted = fixAIMath(text);

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
          <MarkdownRenderer markdown={text} />
        </Card>
      </div>
  );
}; 

