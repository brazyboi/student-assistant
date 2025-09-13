import React, { useEffect, useState } from "react";
import { createProfile, getProfiles } from "../api/profiles";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

interface Profile {
  id: number;
  name: string;
}

export default function ProfileSelector({
  onSelect,
}: {
  onSelect?: (profile: Profile) => void;
}) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    getProfiles().then(setProfiles);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (id: number) => {
    setSelectedId(id);
    const profile = profiles.find((p) => p.id === id);
    if (profile && onSelect) onSelect(profile);
    handleMenuClose();
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
    setNewName("");
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewName("");
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const profile = await createProfile(newName.trim());
    setProfiles((prev) => [...prev, profile]);
    setSelectedId(profile.id);
    if (onSelect) onSelect(profile);
    handleDialogClose();
  };

  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        sx={{ position: "absolute", top: 16, right: 16 }}
        size="large"
      >
        <Avatar alt="Profile" src="" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 200 },
        }}
      >
        <MenuItem disabled>
          <ListItemText primary="Select Profile" />
        </MenuItem>
        <Divider />
        {profiles.map((profile) => (
          <MenuItem
            key={profile.id}
            selected={profile.id === selectedId}
            onClick={() => handleSelect(profile.id)}
          >
            <ListItemText
              primary={profile.name}
              primaryTypographyProps={{
                fontWeight: profile.id === selectedId ? "bold" : "normal",
              }}
            />
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleDialogOpen}>
          {/* <AddIcon fontSize="small" sx={{ mr: 1 }} /> */}
          <ListItemText primary="Create Account" />
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText primary="Settings" />
        </MenuItem>
        <MenuItem>
          <ListItemText primary="Logout" sx={{ color: "red" }} />
        </MenuItem>
      </Menu>
      <CreateProfileDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onCreate={handleCreate}
        newName={newName}
        setNewName={setNewName}
      />
    </>
  );
}

// New component for the popup dialog
function CreateProfileDialog({
  open,
  onClose,
  onCreate,
  newName,
  setNewName,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
  newName: string;
  setNewName: (v: string) => void;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Profile</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            label="Profile Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            fullWidth
            onKeyDown={(e) => {
              if (e.key === "Enter") onCreate();
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onCreate}
          variant="contained"
          disabled={!newName.trim()}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
