import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import { createProfile, loginProfile } from "../api/profiles";

interface ProfileDialogProps {
  dialogType: 'create' | 'login';
  open: boolean;
  onClose: () => void;
};

const dialogTitleMap = {
  'create': 'Create Account',
  'login': 'Log In',
}

export default function ProfileDialog( {dialogType, open, onClose}: ProfileDialogProps ) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");



  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (dialogType == 'create') {
      createProfile(email, password);
    } else if (dialogType == 'login') {
      loginProfile(email, password);
    }
    
    onClose(); 
  };

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="profile-dialog-title"
      >
        <DialogTitle id="profile-dialog-title">{dialogTitleMap[dialogType]}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField
              autoFocus
              required
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              required
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" name="action" value="create" variant="contained">
              Create Account
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}
