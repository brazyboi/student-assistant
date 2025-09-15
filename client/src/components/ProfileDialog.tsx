import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export default function ProfileDialog() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted:", { email, password });
    // TODO: call your createProfile() or API here
    handleClose();
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open Profile Dialog
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
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
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}
