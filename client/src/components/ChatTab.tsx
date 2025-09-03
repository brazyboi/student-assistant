interface ChatTabProps {
  title: string;
  selected?: boolean;
  onClick?: () => void;
}

const ChatItem = ({ title, onClick }: ChatTabProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center w-full p-4 rounded text-left hover:bg-gray-600"
    >
      <span className="flex-1">{title}</span>
    </button>
  );
};

export default ChatItem;