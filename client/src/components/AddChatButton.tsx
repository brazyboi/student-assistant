import React from "react";

import { Button } from "@/components/ui/button";

interface AddChatButtonProps {
  onAdd: () => void;
}

const AddChatButton: React.FC<AddChatButtonProps> = ({ onAdd }) => {
  return (
    <React.Fragment>
      <Button
        color="success"
        className="mb-1 cursor-pointer"
        onClick={onAdd}
      >
        + New Chat
      </Button>
    </React.Fragment>
  );
};

export default AddChatButton;
