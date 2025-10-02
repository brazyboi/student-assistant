import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ProfileDialog from "./ProfileDialog";

import type { Profile } from "../types"
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";

interface ProfileButtonProps {
  activeProfile: Profile | null;
  setActiveProfile: (profile: any) => void;
};

export default function ProfileButton({ activeProfile, setActiveProfile }: ProfileButtonProps) {
  const handleLogout = () => {
    setActiveProfile(null);
  };

  return (
    <>
      { activeProfile === null ? (
        <div className="fixed top-4 right-4">
          <div className="flex">
            <ProfileDialog dialogType="create" onLoginSuccess={setActiveProfile} />
            <ProfileDialog dialogType="login" onLoginSuccess={setActiveProfile} />
          </div>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              aria-label="open profile"
              className="fixed top-4 right-4 z-10 bg-white"
            >
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
