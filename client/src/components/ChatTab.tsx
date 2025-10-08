import { Button } from '@/components/ui/button';
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
        "w-full justify-start text-lg normal-case mb-1 cursor-pointer", // base styles
        selected ? "font-bold" : "font-normal"
      )}
      color={selected ? "primary" : "inherit"}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

export default ChatItem;