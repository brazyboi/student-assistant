import React from "react";

interface AddChatButtonProps {
  onAdd: () => void;
}

const AddChatButton: React.FC<AddChatButtonProps> = ({ onAdd }) => {
  return (
    <button
      type="button"
      className="w-full p-2 mt-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      onClick={onAdd}
    >
      + New Chat
    </button>
  );
};

export default AddChatButton;
