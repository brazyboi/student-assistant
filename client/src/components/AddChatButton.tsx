import React from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";


interface EnterProblemDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

function EnterProblemDialog({ open, onClose, onSubmit }: EnterProblemDialogProps) {
  const [textField, setTextField] = React.useState<string>("");

  const handleSubmit = () => {
    onSubmit(textField);
    onClose()
  }

  return (
    <Dialog 
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth={true}
    >
      <DialogTitle>Enter Problem</DialogTitle>  
      <TextField 
        placeholder="Begin typing..."
        multiline={true}
        rows={3}
        maxRows={9}
        value={textField}
        onChange={(e) => setTextField(e.target.value)}
        sx={{
          mx:'1rem', 
        }}
      />
      <DialogActions>
        {/*Add back button eventually*/}
        <Button type="submit" onClick={handleSubmit} variant="contained"
          sx={{
            mx: '0.5rem'
          }}
        >
            Submit
        </Button>
      </DialogActions>
    
    </Dialog>
  )
}

interface AddChatButtonProps {
  onAdd: () => void;
}

const AddChatButton: React.FC<AddChatButtonProps> = ({ onAdd }) => {
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

  const openDialog = () => {
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
  }

  return (
    <React.Fragment>
      <Button
        variant="contained"
        color="success"
        sx={{ 
          borderRadius: '24px', 
          mb: 1, 
          width: '100%',
        }}
        onClick={openDialog}
      >
        + New Chat
      </Button>
      <EnterProblemDialog open={dialogOpen} onClose={closeDialog} onSubmit={onAdd}/>
    </React.Fragment>
  );
};

export default AddChatButton;
