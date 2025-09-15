import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function ProfileButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* Top-right fixed button */}
      <IconButton
        size="large"
        aria-label="open profile"
        onClick={handleClick}
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

      {/* Dropdown menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </>
  );
}
