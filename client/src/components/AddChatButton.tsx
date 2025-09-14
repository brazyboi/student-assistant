import React from "react";
import { Button } from "@mui/material";

interface AddChatButtonProps {
  onAdd: () => void;
}

const AddChatButton: React.FC<AddChatButtonProps> = ({ onAdd }) => {
  return (
    <Button
      // className="w-full p-2 mt-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      variant="contained"
      color="success"
      sx={{ 
        borderRadius: '24px', 
        mb: 1, 
        mx: 1,
      }}
      onClick={onAdd}
    >
      + New Chat
    </Button>
  );
};

export default AddChatButton;
