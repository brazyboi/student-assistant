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
  setActiveProfile: (profile: any) => void;
};

export default function ProfileButton({ activeProfile, setActiveProfile }: ProfileButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [whichDialogOpen, setDialogOpen] = useState<"login" | "create" | null>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setActiveProfile(null);
    setAnchorEl(null);
  };


  const handleDialogOpen = (type: "login" | "create") => {
    setDialogOpen(type);
  };
  const handleDialogClose = () => {
    setDialogOpen(null);
  };

  return (
    <>
      { activeProfile === null ? (
        <div className="fixed top-4 right-4">
          <Button
            variant="contained"
            onClick={() => handleDialogOpen('create')}
            color="secondary"
            size="small"
            sx={{
              whiteSpace: "nowrap",
              marginX: '0.5rem',
            }}
          >
            Create Account
          </Button>
          <Button
            variant="contained"
            onClick={() => handleDialogOpen('login')}
            size="small"
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            Log In
          </Button>
          
          <ProfileDialog dialogType='login' open={whichDialogOpen === 'login'} onClose={handleDialogClose} onLoginSuccess={setActiveProfile}/>
          <ProfileDialog dialogType='create' open={whichDialogOpen === 'create'} onClose={handleDialogClose} onLoginSuccess={setActiveProfile}/>
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
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      )}
    </>
  );
}
