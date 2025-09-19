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
  open: boolean;
  onClose: () => void;
};

export default function ProfileDialog( {open, onClose}: ProfileDialogProps ) {
  // const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  
  const [action, setAction] = React.useState<"create" | "login" | null>(null);

  // const handleClickOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted:", { email, password });

    // const formData = new FormData(event.currentTarget);
    // console.log(formData);
    // const action = formData.get("action");

    if (action == "create") {
      createProfile(email, password);
    } else if (action == "login") {
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
        <DialogTitle id="profile-dialog-title">Create Profile</DialogTitle>
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
            <Button type="submit" name="action" value="create" variant="contained" onClick={() => setAction("create")}>
              Create Account
            </Button>
            <Button type="submit" name="action" value="login" variant="contained" onClick={() => setAction("login")}>
              Login
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}
