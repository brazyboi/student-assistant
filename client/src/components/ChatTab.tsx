import { Button } from '@/components/ui/button';
import MarkdownRenderer from '@/lib/Markdown';
import { cn } from "@/lib/utils"

interface ChatTabProps {
  title: string;
  selected?: boolean;
  onClick?: () => void;
}

const ChatItem = ({ title, selected, onClick }: ChatTabProps) => {
  return (
    <Button
      className={cn(
        "w-full justify-start text-lg normal-case mb-1 cursor-pointer overflow-hidden truncate", // base styles
        selected ? "font-bold" : "font-normal"
      )}
      color={selected ? "primary" : "inherit"}
      variant={selected ? "default" : "ghost"}
      onClick={onClick}
    >
      <span className="truncate block w-full">
        <MarkdownRenderer markdown={title} />
      </span>
    </Button>
  );
};

export default ChatItem;