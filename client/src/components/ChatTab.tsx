interface ChatTabProps {
  title: string;
  selected?: boolean;
  onClick?: () => void;
}


const ChatItem = ({ title, selected, onClick }: ChatTabProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center w-full p-4 rounded text-left hover:bg-sky-800 transition-colors ${selected ? 'bg-sky-700 text-white font-bold' : ''}`}
    >
      <span className="flex-1">{title}</span>
    </button>
  );
};

export default ChatItem;