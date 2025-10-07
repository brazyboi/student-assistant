import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback} from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from 'lucide-react'; 


import ProfileDialog from "./ProfileDialog";
import { supabase } from "@/api/supabaseClient";

import type { Profile } from "../types"
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";

interface ProfileManagerProps {
  activeProfile: Profile | null;
  setActiveProfile: (profile: any) => void;
};

export default function ProfileManager({ activeProfile, setActiveProfile }: ProfileManagerProps) {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Supabase signout error: ", error)
    }
    console.log("User signed out.");
    setActiveProfile(null);
  };

  return (
    <>
      { activeProfile === null ? (
        <div className="fixed top-4 right-4">
          <div className="flex">
            {/* <ProfileDialog dialogType="create" onLoginSuccess={setActiveProfile} /> */}
            <ProfileDialog dialogType="login" onLoginSuccess={setActiveProfile} />
          </div>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              aria-label="open profile"
              className="fixed top-4 right-4 px-2 cursor-pointer"
            >
              <Avatar>
                <AvatarFallback className='bg-transparent'>
                  <User className="w-5 h-5"></User>
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className='mt-2'>
            <DropdownMenuItem className="cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
