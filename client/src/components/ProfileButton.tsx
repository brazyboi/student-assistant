import { useState } from "react";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import ProfileDialog from "./ProfileDialog";

import type { Profile } from "../types"

interface ProfileButtonProps {
  activeProfile: Profile | null;
};

export default function ProfileButton({ activeProfile }: ProfileButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      { activeProfile === null ? (
        <div>
          <Button
            variant="contained"
            onClick={handleDialogOpen}
            sx={{
              whiteSpace: "nowrap",
              position: "fixed",
              top: 16,
              right: 16,
            }}
          >
            Log In
          </Button>
          <ProfileDialog open={dialogOpen} onClose={handleDialogClose}/>
        </div>
      ) : (
        <div>
          <IconButton
            size="large"
            aria-label="open profile"
            onClick={handleMenuClick}
            sx={{
              color: "white",
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <PersonIcon fontSize="inherit" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </div>
      )}
    </>
  );
}
